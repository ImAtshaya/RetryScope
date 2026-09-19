from io import BytesIO

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.database.simulation_repository import get_simulation_result
from app.database.risk_repository import get_risk_result
from app.database.recommendation_repository import get_recommendation


router = APIRouter(
    prefix="/report",
    tags=["Reports"]
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ReportRequest(BaseModel):
    simulation_id: int
    report_title: str
    project_name: str
    sections: list[str]


# ============================================================
# HELPERS
# ============================================================

def format_number(value):
    try:
        return f"{float(value):,.2f}"
    except (TypeError, ValueError):
        return str(value)


def format_rate(value):
    """
    Formats a rate stored as a fraction.

    Example:
        0.864 -> 86.40%
        0.05  -> 5.00%
    """
    try:
        return f"{float(value) * 100:.2f}%"
    except (TypeError, ValueError):
        return str(value)


def format_score(value):
    """
    Formats a risk score already stored on a 0-100 scale.

    Example:
        25 -> 25.00%
        75 -> 75.00%
    """
    try:
        return f"{float(value):.2f}%"
    except (TypeError, ValueError):
        return str(value)


def add_line(lines, text=""):
    lines.append(text)


# ============================================================
# REPORT GENERATION
# ============================================================

@router.post("/generate")
def generate_report(request: ReportRequest):

    # --------------------------------------------------------
    # Validate title
    # --------------------------------------------------------

    if not request.report_title.strip():
        raise HTTPException(
            status_code=400,
            detail="Report title is required."
        )

    # --------------------------------------------------------
    # Validate project name
    # --------------------------------------------------------

    if not request.project_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Project name is required."
        )

    # --------------------------------------------------------
    # Validate sections
    # --------------------------------------------------------

    if not request.sections:
        raise HTTPException(
            status_code=400,
            detail="At least one report section is required."
        )

    # --------------------------------------------------------
    # Get simulation
    # --------------------------------------------------------

    simulation = get_simulation_result(
        request.simulation_id
    )

    if simulation is None:
        raise HTTPException(
            status_code=404,
            detail="Simulation not found."
        )

    # --------------------------------------------------------
    # Find associated risk result
    # --------------------------------------------------------

    from app.database.connection import get_connection

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM risk_results
            WHERE simulation_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (request.simulation_id,)
        )

        row = cursor.fetchone()

    finally:
        cursor.close()
        connection.close()

    risk = None
    recommendation = None

    # --------------------------------------------------------
    # Get risk and recommendation
    # --------------------------------------------------------

    if row:

        risk_id = row[0]

        risk = get_risk_result(
            risk_id
        )

        if risk:

            connection = get_connection()

            try:
                cursor = connection.cursor()

                cursor.execute(
                    """
                    SELECT id
                    FROM recommendations
                    WHERE risk_result_id = %s
                    ORDER BY id DESC
                    LIMIT 1
                    """,
                    (risk["id"],)
                )

                recommendation_row = cursor.fetchone()

            finally:
                cursor.close()
                connection.close()

            if recommendation_row:

                recommendation = get_recommendation(
                    recommendation_row[0]
                )

    # ========================================================
    # BUILD REPORT TEXT
    # ========================================================

    lines = []

    add_line(
        lines,
        request.report_title.strip()
    )

    add_line(
        lines,
        request.project_name.strip()
    )

    add_line(lines)

    add_line(
        lines,
        "RetryScope Pre-Deployment Reliability Report"
    )

    add_line(lines)

    add_line(
        lines,
        "=" * 70
    )

    # ========================================================
    # EXECUTIVE SUMMARY
    # ========================================================

    if "Executive Summary" in request.sections:

        add_line(lines)

        add_line(
            lines,
            "1. EXECUTIVE SUMMARY"
        )

        add_line(lines)

        add_line(
            lines,
            (
                f"The simulation processed "
                f"{simulation['total_requests']:,} original requests "
                f"for the {simulation['service']} service."
            )
        )

        add_line(
            lines,
            (
                f"The simulation recorded "
                f"{simulation['failed_requests']:,} failed requests "
                f"and {simulation['total_retries']:,} retry attempts."
            )
        )

        add_line(
            lines,
            (
                f"The retry amplification factor was "
                f"{format_number(simulation['retry_amplification_factor'])}x."
            )
        )

        if risk:

            add_line(
                lines,
                (
                    f"The calculated overall risk score was "
                    f"{format_score(risk['overall_score'])} "
                    f"({risk['risk_level']})."
                )
            )

    # ========================================================
    # SERVICE TOPOLOGY
    # ========================================================

    if "Service Topology" in request.sections:

        add_line(lines)

        add_line(
            lines,
            "2. SERVICE TOPOLOGY"
        )

        add_line(lines)

        add_line(
            lines,
            (
                f"Primary simulated service: "
                f"{simulation['service']}"
            )
        )

        add_line(
            lines,
            (
                f"Configured users: "
                f"{simulation['users']}"
            )
        )

    # ========================================================
    # FAULT INJECTION
    # ========================================================

    if "Fault Injection Results" in request.sections:

        add_line(lines)

        add_line(
            lines,
            "3. FAULT INJECTION RESULTS"
        )

        add_line(lines)

        add_line(
            lines,
            (
                "Fault-injection-specific measurements are "
                "included when available from the simulation."
            )
        )

        add_line(
            lines,
            (
                f"Observed failed requests: "
                f"{simulation['failed_requests']:,}"
            )
        )

    # ========================================================
    # SIMULATION RESULTS
    # ========================================================

    if "Simulation Results" in request.sections:

        add_line(lines)

        add_line(
            lines,
            "4. SIMULATION RESULTS"
        )

        add_line(lines)

        add_line(
            lines,
            f"Users: {simulation['users']}"
        )

        add_line(
            lines,
            f"Service: {simulation['service']}"
        )

        add_line(
            lines,
            f"Total requests: {simulation['total_requests']:,}"
        )

        add_line(
            lines,
            (
                f"Successful requests: "
                f"{simulation['successful_requests']:,}"
            )
        )

        add_line(
            lines,
            (
                f"Failed requests: "
                f"{simulation['failed_requests']:,}"
            )
        )

        add_line(
            lines,
            (
                f"Total retries: "
                f"{simulation['total_retries']:,}"
            )
        )

        add_line(
            lines,
            (
                "Retry amplification: "
                f"{format_number(simulation['retry_amplification_factor'])}x"
            )
        )

        # Simulation failure_rate is stored as a fraction.
        add_line(
            lines,
            (
                "Failure rate: "
                f"{format_rate(simulation['failure_rate'])}"
            )
        )

        # Simulation success_rate is stored as a fraction.
        add_line(
            lines,
            (
                "Success rate: "
                f"{format_rate(simulation['success_rate'])}"
            )
        )

        add_line(
            lines,
            (
                "Average retries: "
                f"{format_number(simulation['average_retries'])}"
            )
        )

        add_line(
            lines,
            (
                "Average duration: "
                f"{format_number(simulation['average_duration'])}"
            )
        )

        add_line(
            lines,
            (
                "Maximum retries used: "
                f"{simulation['max_retries_used']}"
            )
        )

    # ========================================================
    # RISK ASSESSMENT
    # ========================================================

    if "Risk Assessment" in request.sections:

        add_line(lines)

        add_line(
            lines,
            "5. RISK ASSESSMENT"
        )

        add_line(lines)

        if risk:

            add_line(
                lines,
                (
                    f"Retry storm risk: "
                    f"{format_score(risk['retry_risk'])}"
                )
            )

            add_line(
                lines,
                (
                    f"Failure risk: "
                    f"{format_score(risk['failure_risk'])}"
                )
            )

            add_line(
                lines,
                (
                    f"Cascade risk: "
                    f"{format_score(risk['cascade_risk'])}"
                )
            )

            add_line(
                lines,
                (
                    f"Overall risk score: "
                    f"{format_score(risk['overall_score'])}"
                )
            )

            add_line(
                lines,
                (
                    f"Risk level: "
                    f"{risk['risk_level']}"
                )
            )

            add_line(lines)

            add_line(
                lines,
                "Risk explanation:"
            )

            add_line(
                lines,
                risk.get("risk_explanation")
                or "No risk explanation available."
            )

        else:

            add_line(
                lines,
                "No risk assessment is associated with this simulation."
            )

    # ========================================================
    # VISUALIZATIONS
    # ========================================================

    if "Visualizations" in request.sections:

        add_line(lines)

        add_line(
            lines,
            "6. VISUALIZATIONS"
        )

        add_line(lines)

        add_line(
            lines,
            (
                f"Total requests: "
                f"{simulation['total_requests']:,}"
            )
        )

        add_line(
            lines,
            (
                f"Retry attempts: "
                f"{simulation['total_retries']:,}"
            )
        )

        add_line(
            lines,
            (
                f"Retry amplification: "
                f"{format_number(simulation['retry_amplification_factor'])}x"
            )
        )

        add_line(
            lines,
            (
                f"Failure rate: "
                f"{format_rate(simulation['failure_rate'])}"
            )
        )

        if risk:

            add_line(
                lines,
                (
                    f"Overall risk: "
                    f"{format_score(risk['overall_score'])}"
                )
            )

    # ========================================================
    # SCENARIO COMPARISON
    # ========================================================

    if "Scenario Comparison" in request.sections:

        add_line(lines)

        add_line(
            lines,
            "7. SCENARIO COMPARISON"
        )

        add_line(lines)

        add_line(
            lines,
            (
                "This report contains the selected simulation "
                "result. Multi-scenario comparison data is "
                "available through the Comparison analysis."
            )
        )

        add_line(
            lines,
            (
                f"Current simulation risk: "
                f"{format_score(risk['overall_score'])}"
                if risk
                else "Current simulation risk: unavailable"
            )
        )

        add_line(
            lines,
            (
                f"Current retry amplification: "
                f"{format_number(simulation['retry_amplification_factor'])}x"
            )
        )

    # ========================================================
    # RECOMMENDATIONS
    # ========================================================

    if "Recommendations" in request.sections:

        add_line(lines)

        add_line(
            lines,
            "8. RECOMMENDATIONS"
        )

        add_line(lines)

        if recommendation:

            # ------------------------------------------------
            # Recommendation repository returns a FLAT object:
            #
            # {
            #   "risk_level": ...,
            #   "overall_score": ...,
            #   "recommended_max_retries": ...,
            #   "recommended_backoff_multiplier": ...,
            #   "recommended_jitter": ...,
            #   "recommended_circuit_breaker": ...,
            #   "recommended_dependency_isolation": ...,
            #   "recommendation_text": ...
            # }
            # ------------------------------------------------

            add_line(
                lines,
                (
                    f"Recommendation risk level: "
                    f"{recommendation.get('risk_level', 'Unavailable')}"
                )
            )

            add_line(
                lines,
                (
                    "Recommended maximum retries: "
                    f"{recommendation.get('recommended_max_retries')}"
                )
            )

            add_line(
                lines,
                (
                    "Recommended backoff multiplier: "
                    f"{recommendation.get('recommended_backoff_multiplier')}"
                )
            )

            add_line(
                lines,
                (
                    "Recommended jitter: "
                    f"{recommendation.get('recommended_jitter')}"
                )
            )

            add_line(
                lines,
                (
                    "Circuit breaker: "
                    f"{recommendation.get('recommended_circuit_breaker')}"
                )
            )

            add_line(
                lines,
                (
                    "Dependency isolation: "
                    f"{recommendation.get('recommended_dependency_isolation')}"
                )
            )

            add_line(lines)

            recommendation_text = recommendation.get(
                "recommendation_text"
            )

            if recommendation_text:

                add_line(
                    lines,
                    f"Recommendation: {recommendation_text}"
                )

            else:

                add_line(
                    lines,
                    "No detailed recommendation text available."
                )

        else:

            add_line(
                lines,
                "No recommendation is associated with this simulation."
            )

    # ========================================================
    # FINAL FOOTER
    # ========================================================

    add_line(lines)

    add_line(
        lines,
        "=" * 70
    )

    add_line(
        lines,
        "Generated by RetryScope"
    )

    # ========================================================
    # CREATE PDF
    # ========================================================

    try:

        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.platypus import (
            SimpleDocTemplate,
            Paragraph,
            Spacer
        )
        from reportlab.lib.enums import TA_CENTER

    except ImportError:

        raise HTTPException(
            status_code=500,
            detail=(
                "Report generation requires the "
                "'reportlab' package."
            )
        )

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    title_style = styles["Title"]
    title_style.alignment = TA_CENTER

    normal_style = styles["BodyText"]

    story = []

    # ========================================================
    # BUILD PDF CONTENT
    # ========================================================

    for index, line in enumerate(lines):

        if index == 0:

            story.append(
                Paragraph(
                    line,
                    title_style
                )
            )

        elif line == "=" * 70:

            story.append(
                Spacer(1, 10)
            )

        elif line == "":

            story.append(
                Spacer(1, 8)
            )

        elif (
            line[:2].isdigit()
            and ". " in line[:4]
        ):

            story.append(
                Paragraph(
                    f"<b>{line}</b>",
                    styles["Heading2"]
                )
            )

            story.append(
                Spacer(1, 5)
            )

        else:

            safe_line = (
                str(line)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
            )

            story.append(
                Paragraph(
                    safe_line,
                    normal_style
                )
            )

            story.append(
                Spacer(1, 4)
            )

    document.build(story)

    buffer.seek(0)

    # ========================================================
    # DOWNLOAD
    # ========================================================

    filename = (
        request.report_title
        .strip()
        .replace(" ", "_")
        .replace("/", "_")
        .replace("\\", "_")
    )

    if not filename:
        filename = "RetryScope_Report"

    filename += ".pdf"

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}"'
        }
    )