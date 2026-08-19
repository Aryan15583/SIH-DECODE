"""
Autonomous SOC Report Generation Service
-----------------------------------------
Generates comprehensive PDF security reports using ReportLab:
- Incident Investigation Reports
- Executive Security Summaries
- Compliance & Threat Audit Reports
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from utils.logger import get_logger

logger = get_logger("report_service")

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

class ReportService:
    @staticmethod
    def _build_base_styles():
        styles = getSampleStyleSheet()
        
        # Custom styles with dark/modern SOC aesthetic palette
        styles.add(ParagraphStyle(
            name="ReportTitle",
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#1e1e2d")
        ))
        styles.add(ParagraphStyle(
            name="ReportSubtitle",
            fontName="Helvetica",
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#6c757d")
        ))
        styles.add(ParagraphStyle(
            name="SectionHeading",
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#3f4254"),
            spaceBefore=12,
            spaceAfter=6
        ))
        styles.add(ParagraphStyle(
            name="BodyDark",
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#212529")
        ))
        styles.add(ParagraphStyle(
            name="BadgeCritical",
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=12,
            textColor=colors.HexColor("#d9534f")
        ))
        return styles

    @staticmethod
    def generate_incident_report(
        incident_id: str,
        title: str,
        severity: str,
        risk_score: int,
        status: str,
        attacker: str = "Unknown",
        attacker_location: str = "Unknown",
        ai_summary: str = "",
        timeline: list = None,
        recommended_actions: list = None,
        evidence: str = ""
    ) -> str:
        """
        Generates a PDF incident report and saves to static/reports/.
        Returns the relative filepath.
        """
        filename = f"{incident_id.lower()}_report.pdf"
        filepath = os.path.join(REPORTS_DIR, filename)

        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = ReportService._build_base_styles()
        elements = []

        # 1. Header Banner
        elements.append(Paragraph("AegisSOC Autonomous Security Center", styles["ReportSubtitle"]))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"Security Incident Audit: {incident_id}", styles["ReportTitle"]))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph(f"Generated on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')} | Automated Incident Analysis", styles["ReportSubtitle"]))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#7c3aed"), spaceAfter=15))

        # 2. Executive Overview Table
        overview_data = [
            [
                Paragraph("<b>Incident Title:</b>", styles["BodyDark"]),
                Paragraph(title, styles["BodyDark"]),
                Paragraph("<b>Severity:</b>", styles["BodyDark"]),
                Paragraph(f"<font color='{'#d9534f' if severity in ['Critical', 'High'] else '#f0ad4e'}'><b>{severity}</b></font>", styles["BodyDark"])
            ],
            [
                Paragraph("<b>Calculated Risk Score:</b>", styles["BodyDark"]),
                Paragraph(f"<b>{risk_score} / 100</b>", styles["BodyDark"]),
                Paragraph("<b>Incident Status:</b>", styles["BodyDark"]),
                Paragraph(f"<b>{status}</b>", styles["BodyDark"])
            ],
            [
                Paragraph("<b>Attacker Vector:</b>", styles["BodyDark"]),
                Paragraph(f"{attacker} ({attacker_location})", styles["BodyDark"]),
                Paragraph("<b>Orchestration State:</b>", styles["BodyDark"]),
                Paragraph("Simulated Autonomous Playbook", styles["BodyDark"])
            ]
        ]

        overview_table = Table(overview_data, colWidths=[130, 150, 110, 150])
        overview_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8f9fa")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#dee2e6")),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e9ecef")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(overview_table)
        elements.append(Spacer(1, 15))

        # 3. AI Threat Reasoning & Summary
        elements.append(Paragraph("AI Threat Reasoning & Incident Summary", styles["SectionHeading"]))
        summary_text = ai_summary or "Autonomous investigation observed anomalous network and host indicators correlating to known threat patterns."
        elements.append(Paragraph(summary_text, styles["BodyDark"]))
        elements.append(Spacer(1, 15))

        # 4. Incident Timeline
        elements.append(Paragraph("Observed Incident Timeline", styles["SectionHeading"]))
        if timeline and len(timeline) > 0:
            timeline_rows = [[Paragraph("<b>Time (UTC)</b>", styles["BodyDark"]), Paragraph("<b>Correlated Event Description</b>", styles["BodyDark"])]]
            for item in timeline:
                t_val = item.get("time", "—")
                e_val = item.get("event", "—")
                timeline_rows.append([Paragraph(t_val, styles["BodyDark"]), Paragraph(e_val, styles["BodyDark"])])
            
            t_table = Table(timeline_rows, colWidths=[120, 420])
            t_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#ede9fe")),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#c4b5fd")),
                ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e9ecef")),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ]))
            elements.append(t_table)
        else:
            elements.append(Paragraph("No timeline entries recorded.", styles["BodyDark"]))
        elements.append(Spacer(1, 15))

        # 5. Response Actions & Remediation Playbooks
        elements.append(Paragraph("Recommended & Simulated Containment Actions", styles["SectionHeading"]))
        if recommended_actions and len(recommended_actions) > 0:
            rec_rows = [[Paragraph("<b>#</b>", styles["BodyDark"]), Paragraph("<b>Action Type</b>", styles["BodyDark"]), Paragraph("<b>Execution Mode</b>", styles["BodyDark"])]]
            for idx, act in enumerate(recommended_actions, 1):
                rec_rows.append([
                    Paragraph(str(idx), styles["BodyDark"]),
                    Paragraph(act, styles["BodyDark"]),
                    Paragraph("Simulated (Safe Sandbox)", styles["BodyDark"])
                ])
            r_table = Table(rec_rows, colWidths=[30, 310, 200])
            r_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
                ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ]))
            elements.append(r_table)
        elements.append(Spacer(1, 15))

        # 6. Forensic Evidence
        if evidence:
            elements.append(Paragraph("Forensic Log Evidence", styles["SectionHeading"]))
            elements.append(Paragraph(f"<font color='#475569'><code>{evidence}</code></font>", styles["BodyDark"]))
            elements.append(Spacer(1, 15))

        # 7. Sign-off Footer
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0"), spaceAfter=10))
        elements.append(Paragraph("Report verified by AegisSOC Autonomous Agent Core. Confidential & Proprietary.", styles["ReportSubtitle"]))

        doc.build(elements)
        logger.info(f"Generated incident PDF report: {filepath}")
        return f"static/reports/{filename}"

    @staticmethod
    def generate_security_summary_report(
        report_id: str,
        total_alerts: int,
        critical_alerts: int,
        active_incidents: int,
        risk_score: int
    ) -> str:
        """
        Generates an Executive Security Summary Report.
        """
        filename = f"{report_id.lower()}_summary.pdf"
        filepath = os.path.join(REPORTS_DIR, filename)

        doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        styles = ReportService._build_base_styles()
        elements = []

        elements.append(Paragraph("AegisSOC Autonomous Security Center", styles["ReportSubtitle"]))
        elements.append(Paragraph("Weekly Executive Threat & Posture Summary", styles["ReportTitle"]))
        elements.append(Paragraph(f"Generated on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')} | Security Operations Review", styles["ReportSubtitle"]))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#7c3aed"), spaceAfter=15))

        # KPI Metrics Table
        kpi_data = [
            [Paragraph("<b>Metric</b>", styles["BodyDark"]), Paragraph("<b>Value</b>", styles["BodyDark"]), Paragraph("<b>Status</b>", styles["BodyDark"])],
            [Paragraph("Overall Security Posture Score", styles["BodyDark"]), Paragraph(f"<b>{risk_score} / 100</b>", styles["BodyDark"]), Paragraph("Optimal" if risk_score > 75 else "Needs Review", styles["BodyDark"])],
            [Paragraph("Total Security Alerts Ingested", styles["BodyDark"]), Paragraph(str(total_alerts), styles["BodyDark"]), Paragraph("Monitored", styles["BodyDark"])],
            [Paragraph("Critical Severity Alerts", styles["BodyDark"]), Paragraph(str(critical_alerts), styles["BodyDark"]), Paragraph("Contained" if critical_alerts == 0 else "Active Investigation", styles["BodyDark"])],
            [Paragraph("Active Correlated Incidents", styles["BodyDark"]), Paragraph(str(active_incidents), styles["BodyDark"]), Paragraph("Under Control", styles["BodyDark"])]
        ]

        t = Table(kpi_data, colWidths=[240, 150, 150])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#ede9fe")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#c4b5fd")),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 20))

        elements.append(Paragraph("Autonomous Multi-Agent SOC Activity", styles["SectionHeading"]))
        elements.append(Paragraph(
            "During this reporting cycle, the Autonomous SOC Detection and Investigation Agents continuously correlated raw telemetry logs, evaluated MITRE ATT&CK techniques, and recommended safe simulated containment playbooks.",
            styles["BodyDark"]
        ))

        doc.build(elements)
        logger.info(f"Generated security summary PDF report: {filepath}")
        return f"static/reports/{filename}"
