import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validators/auth";
import { verifyPwd } from "@/lib/crypto";
import { createSession } from "@/lib/sessionHelper";
import { withContext } from "@/lib/HttpContext";
import { getUserRole } from "@/lib/rbac-helper";
import { permission } from "process";


export const POST = withContext(async ({ tenantDb }, request: Request) => {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const { username, password } = parsed.data;

    /*     if (!username || !password) {
          return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 })
        } */



    // Query user from database
    const users = (await db`
      SELECT 
        id,
        first_name,
        last_name,
        username,
        email,
        phone,
        organization_id,
        department_id,
        job_title,
        status,
        created_at,
        password_hash,
        schemaid
      FROM users 
      WHERE status = 'Active'
      AND username = ${username}
      LIMIT 1
    `) as Record<string, any>[];


    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 });
    }

    const user = users[0]

    const isPwdCheckPass = await verifyPwd(password, user.password_hash);
    if (!isPwdCheckPass) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 });
    }

    //rolebased settings will be here
    const permissions:[] = await getUserRole(user.id, user.schemaid);

    if(!permissions || permissions.length == 0){      
      return NextResponse.json({ success: false, error: "No permissions are assinged, Please contact administrator" }, { status: 403 })
    }
    user.permissions = permissions;

    await createSession(user);
    
    const sideBarMenu = await getSideBarMenu(user.permissions);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        organizationId: user.organization_id,
        departmentId: user.department_id,
        jobTitle: user.job_title,
        status: user.status,

      },
      permissionMap: user.permissions,
      menuList: sideBarMenu,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});


async function getSideBarMenu(perms) {

  /* const _sidebarMenu = permissions.reduce((acc: any, item) => {
    if (!acc[item.module]) {
      acc[item.module] = {
        module: item.module,
        pages: [],
      };
    }

    acc[item.module].pages.push({
      id: item.pageId,
      name: item.pageName,
      path: item.pagePath,
      //  canRead: item.canRead,
      // canCreate: item.canCreate,
      // canUpdate: item.canUpdate,
      // canDelete: item.canDelete,
    });

    return acc;
  }, {}); */

  const groupedByModule = perms.reduce((dict: any, item) => {
    if (!dict[item.module]) dict[item.module] = []
    dict[item.module].push(item)
    return dict
  }, {})
  
  const _sidebarMenu = Object.entries(groupedByModule).map(([module, items]: [string, any[]]) => {
    if (items.length > 1) {
      return {
        title: module,
        icon: items[0].icon,
        children: items.map(it => ({
          title: it.pageName,
          href: it.pagePath,
          icon: it.icon,
        })),
      }
    } else {
      const it = items[0]
      return {
        title: it.pageName,
        href: it.pagePath,
        icon: it.icon,
      }
    }
  })

  return Object.values(_sidebarMenu);
}
