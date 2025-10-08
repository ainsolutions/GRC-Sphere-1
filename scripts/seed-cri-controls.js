// Seed script for CRI (Cyber Risk Institute) Controls
const { getDatabase } = require('../lib/database')

const criControls = [
  {
    control_id: "CRI-001",
    control_name: "Risk Management Framework",
    domain: "Governance",
    control_objective: "Establish a comprehensive risk management framework that integrates cyber risk management into overall enterprise risk management",
    maturity_level_1: "Basic risk management processes exist but are not formalized",
    maturity_level_2: "Risk management framework is documented and approved",
    maturity_level_3: "Risk management framework is integrated with business processes",
    maturity_level_4: "Advanced risk quantification and reporting capabilities",
    maturity_level_5: "Predictive risk analytics and automated decision-making"
  },
  {
    control_id: "CRI-002",
    control_name: "Cybersecurity Strategy",
    domain: "Governance",
    control_objective: "Develop and maintain a comprehensive cybersecurity strategy aligned with business objectives",
    maturity_level_1: "Basic cybersecurity policies exist",
    maturity_level_2: "Cybersecurity strategy is documented and communicated",
    maturity_level_3: "Strategy is aligned with business objectives and risk appetite",
    maturity_level_4: "Strategy includes advanced threat intelligence and response capabilities",
    maturity_level_5: "Strategy incorporates emerging technologies and predictive capabilities"
  },
  {
    control_id: "CRI-003",
    control_name: "Asset Management",
    domain: "Information Security",
    control_objective: "Identify, classify, and manage information assets throughout their lifecycle",
    maturity_level_1: "Basic asset inventory exists",
    maturity_level_2: "Assets are classified and inventoried regularly",
    maturity_level_3: "Asset management is integrated with risk management",
    maturity_level_4: "Automated asset discovery and classification",
    maturity_level_5: "Real-time asset monitoring and automated lifecycle management"
  },
  {
    control_id: "CRI-004",
    control_name: "Access Control",
    domain: "Information Security",
    control_objective: "Implement and maintain access controls to protect information assets",
    maturity_level_1: "Basic access controls implemented",
    maturity_level_2: "Role-based access control (RBAC) implemented",
    maturity_level_3: "Multi-factor authentication and privileged access management",
    maturity_level_4: "Attribute-based access control and zero-trust architecture",
    maturity_level_5: "Continuous authentication and adaptive access controls"
  },
  {
    control_id: "CRI-005",
    control_name: "Network Security",
    domain: "Information Security",
    control_objective: "Protect network infrastructure and data in transit",
    maturity_level_1: "Basic firewall and antivirus protection",
    maturity_level_2: "Network segmentation and intrusion detection",
    maturity_level_3: "Advanced network monitoring and threat detection",
    maturity_level_4: "Software-defined networking and micro-segmentation",
    maturity_level_5: "AI-driven network security and automated response"
  },
  {
    control_id: "CRI-006",
    control_name: "Incident Response",
    domain: "Operations",
    control_objective: "Develop and maintain incident response capabilities",
    maturity_level_1: "Basic incident response plan exists",
    maturity_level_2: "Incident response team and procedures established",
    maturity_level_3: "Regular incident response testing and improvement",
    maturity_level_4: "Advanced threat hunting and intelligence-driven response",
    maturity_level_5: "Automated incident response and predictive capabilities"
  },
  {
    control_id: "CRI-007",
    control_name: "Business Continuity",
    domain: "Operations",
    control_objective: "Ensure business continuity and disaster recovery capabilities",
    maturity_level_1: "Basic backup procedures exist",
    maturity_level_2: "Business continuity plan documented",
    maturity_level_3: "Regular testing and plan updates",
    maturity_level_4: "Cloud-based disaster recovery and automated failover",
    maturity_level_5: "AI-driven continuity planning and real-time adaptation"
  },
  {
    control_id: "CRI-008",
    control_name: "Compliance Management",
    domain: "Compliance",
    control_objective: "Manage compliance with applicable laws, regulations, and standards",
    maturity_level_1: "Basic compliance awareness",
    maturity_level_2: "Compliance requirements identified and monitored",
    maturity_level_3: "Compliance integrated into business processes",
    maturity_level_4: "Automated compliance monitoring and reporting",
    maturity_level_5: "Predictive compliance analytics and automated remediation"
  },
  {
    control_id: "CRI-009",
    control_name: "Third-Party Risk Management",
    domain: "Supply Chain",
    control_objective: "Manage risks associated with third-party relationships",
    maturity_level_1: "Basic vendor assessments",
    maturity_level_2: "Third-party risk management process established",
    maturity_level_3: "Advanced vendor risk assessments and monitoring",
    maturity_level_4: "Integrated supply chain risk management",
    maturity_level_5: "Predictive third-party risk analytics"
  },
  {
    control_id: "CRI-010",
    control_name: "Security Awareness Training",
    domain: "People",
    control_objective: "Develop and maintain security awareness among personnel",
    maturity_level_1: "Basic security awareness training",
    maturity_level_2: "Regular security training program",
    maturity_level_3: "Role-specific security training and awareness campaigns",
    maturity_level_4: "Advanced training with simulations and metrics",
    maturity_level_5: "Continuous learning platform with AI-driven content"
  }
]

async function seedCRIControls() {
  try {
    const sql = getDatabase()

    console.log('Seeding CRI Controls...')

    for (const control of criControls) {
      await sql`
        INSERT INTO cri_controls (
          control_id, control_name, domain, control_objective,
          maturity_level_1, maturity_level_2, maturity_level_3,
          maturity_level_4, maturity_level_5
        ) VALUES (
          ${control.control_id}, ${control.control_name}, ${control.domain},
          ${control.control_objective}, ${control.maturity_level_1},
          ${control.maturity_level_2}, ${control.maturity_level_3},
          ${control.maturity_level_4}, ${control.maturity_level_5}
        )
        ON CONFLICT (control_id) DO NOTHING
      `
    }

    console.log('CRI Controls seeded successfully!')
  } catch (error) {
    console.error('Error seeding CRI controls:', error)
  }
}

if (require.main === module) {
  seedCRIControls()
}

module.exports = { seedCRIControls }
