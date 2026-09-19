import { useState } from 'react'
import './ExportReportPage.css'
import { generateReport } from '../../services/reportApi'

const REPORT_SECTIONS = [
  'Executive Summary',
  'Service Topology',
  'Fault Injection Results',
  'Simulation Results',
  'Risk Assessment',
  'Visualizations',
  'Scenario Comparison',
  'Recommendations',
]

const DEFAULT_REPORT_TITLE =
  'RetryScope Pre-Deployment Reliability Analysis'

const DEFAULT_PROJECT_NAME =
  'Microservice Retry Risk Analysis'

function ExportReportPage() {
  const [reportTitle, setReportTitle] =
    useState(DEFAULT_REPORT_TITLE)

  const [projectName, setProjectName] =
    useState(DEFAULT_PROJECT_NAME)

  const [selectedSections, setSelectedSections] =
    useState(REPORT_SECTIONS)

  const [reportStatus, setReportStatus] =
    useState('DRAFT')

  const [generatedSections, setGeneratedSections] =
    useState([])

  const [toastMessage, setToastMessage] =
    useState('')

  // =========================================================
  // Toggle report section
  // =========================================================

  const toggleSection = (section) => {
    setSelectedSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section]
    )

    // Editing configuration makes report draft again
    setReportStatus('DRAFT')
    setGeneratedSections([])
  }

  // =========================================================
  // Generate Report
  // =========================================================

  const handleGenerateReport = async () => {
    // -------------------------------------------------------
    // Validate report title
    // -------------------------------------------------------

    if (!reportTitle.trim()) {
      setToastMessage(
        'Please enter a report title.'
      )
      return
    }

    // -------------------------------------------------------
    // Validate project name
    // -------------------------------------------------------

    if (!projectName.trim()) {
      setToastMessage(
        'Please enter a project name.'
      )
      return
    }

    // -------------------------------------------------------
    // Validate sections
    // -------------------------------------------------------

    if (selectedSections.length === 0) {
      setToastMessage(
        'Select at least one report section.'
      )
      return
    }

    // -------------------------------------------------------
    // Get latest simulation ID
    //
    // SimulationPage.jsx already stores it using:
    //
    // localStorage.setItem(
    //   'lastSimulationId',
    //   String(simulationId)
    // )
    // -------------------------------------------------------

    const simulationId =
      localStorage.getItem(
        'lastSimulationId'
      )

    if (!simulationId) {
      setToastMessage(
        'No simulation result found. Run a simulation first.'
      )
      return
    }

    // -------------------------------------------------------
    // Generate report
    // -------------------------------------------------------

    try {
      setReportStatus('GENERATING')

      setToastMessage(
        'Generating report...'
      )

      // -----------------------------------------------------
      // Call FastAPI
      //
      // POST /report/generate
      // -----------------------------------------------------

      const pdfBlob = await generateReport({
        simulation_id: Number(simulationId),

        report_title:
          reportTitle.trim(),

        project_name:
          projectName.trim(),

        sections:
          selectedSections,
      })

      // -----------------------------------------------------
      // Create temporary URL for PDF
      // -----------------------------------------------------

      const downloadUrl =
        window.URL.createObjectURL(
          pdfBlob
        )

      // -----------------------------------------------------
      // Create browser download
      // -----------------------------------------------------

      const link =
        document.createElement('a')

      link.href = downloadUrl

      link.download =
        `${reportTitle.trim()}.pdf`

      document.body.appendChild(link)

      link.click()

      link.remove()

      // -----------------------------------------------------
      // Release temporary URL
      // -----------------------------------------------------

      window.URL.revokeObjectURL(
        downloadUrl
      )

      // -----------------------------------------------------
      // Update UI
      // -----------------------------------------------------

      setGeneratedSections([
        ...selectedSections
      ])

      setReportStatus('GENERATED')

      setToastMessage(
        'Report generated and downloaded successfully.'
      )

    } catch (error) {
      console.error(
        'Report generation failed:',
        error
      )

      setReportStatus('DRAFT')

      setToastMessage(
        error?.message ||
        'Failed to generate report.'
      )
    }
  }

  // =========================================================
  // Reset
  // =========================================================

  const handleReset = () => {
    setReportTitle(
      DEFAULT_REPORT_TITLE
    )

    setProjectName(
      DEFAULT_PROJECT_NAME
    )

    setSelectedSections(
      REPORT_SECTIONS
    )

    setGeneratedSections([])

    setReportStatus('DRAFT')

    setToastMessage(
      'Report settings reset.'
    )
  }

  return (
    <section className="export-report-page">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="export-header">

        <div>

          <span className="eyebrow">
            OUTPUT
          </span>

          <h1>
            Export Report
          </h1>

          <p>
            Review your analysis results and generate a
            pre-deployment reliability report.
          </p>

        </div>

        <div className="export-header-actions">

          <button
            className="secondary-button"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            className="primary-button"
            onClick={handleGenerateReport}
            disabled={reportStatus === 'GENERATING'}
          >
            {reportStatus === 'GENERATING'
              ? 'Generating...'
              : 'Generate Report'}
          </button>

        </div>

      </div>


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="export-layout">

        {/* =================================================
            CONFIGURATION
        ================================================= */}

        <div className="panel report-config-panel">

          <div className="panel-header">

            <div>

              <span className="eyebrow">
                CONFIGURATION
              </span>

              <h2>
                Report Settings
              </h2>

            </div>

            <span
              className={`status-badge ${
                reportStatus === 'GENERATED'
                  ? 'success'
                  : ''
              }`}
            >
              {reportStatus}
            </span>

          </div>


          {/* =================================================
              REPORT TITLE
          ================================================= */}

          <div className="form-group">

            <label htmlFor="report-title">
              Report Title
            </label>

            <input
              id="report-title"
              type="text"
              value={reportTitle}
              onChange={(event) => {

                setReportTitle(
                  event.target.value
                )

                setReportStatus('DRAFT')

                setGeneratedSections([])
              }}
            />

          </div>


          {/* =================================================
              PROJECT NAME
          ================================================= */}

          <div className="form-group">

            <label htmlFor="project-name">
              Project / Architecture
            </label>

            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(event) => {

                setProjectName(
                  event.target.value
                )

                setReportStatus('DRAFT')

                setGeneratedSections([])
              }}
            />

          </div>


          {/* =================================================
              SECTION SELECTOR
          ================================================= */}

          <div className="section-selector">

            <div className="section-selector-header">

              <div>

                <span className="eyebrow">
                  REPORT CONTENT
                </span>

                <h3>
                  Sections
                </h3>

              </div>

              <span className="muted">
                {selectedSections.length}/
                {REPORT_SECTIONS.length}
              </span>

            </div>


            <div className="section-list">

              {REPORT_SECTIONS.map(
                (section) => (

                  <label
                    className="section-option"
                    key={section}
                  >

                    <input
                      type="checkbox"
                      checked={
                        selectedSections.includes(
                          section
                        )
                      }
                      onChange={() =>
                        toggleSection(section)
                      }
                    />

                    <span>
                      {section}
                    </span>

                  </label>

                )
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            PREVIEW
        ================================================= */}

        <div className="panel report-preview-panel">

          <div className="panel-header">

            <div>

              <span className="eyebrow">
                PREVIEW
              </span>

              <h2>
                Report Preview
              </h2>

            </div>

            <span
              className={`status-badge ${
                reportStatus === 'GENERATED'
                  ? 'success'
                  : ''
              }`}
            >
              {reportStatus}
            </span>

          </div>


          <div className="report-preview">

            {/* =================================================
                REPORT COVER
            ================================================= */}

            <div className="report-cover">

              <span className="report-brand">
                RETRYSCOPE
              </span>

              <h2>
                {reportTitle}
              </h2>

              <p>
                {projectName}
              </p>

              <div className="report-divider"></div>

              <span className="muted">
                Pre-deployment reliability analysis
              </span>

            </div>


            {/* =================================================
                GENERATED CONTENT
            ================================================= */}

            {reportStatus === 'GENERATED' ? (

              <div className="generated-report">

                <div className="generated-report-header">

                  <span>
                    REPORT CONTENT
                  </span>

                  <strong>
                    {generatedSections.length}{' '}
                    sections generated
                  </strong>

                </div>


                <div className="generated-section-list">

                  {generatedSections.map(
                    (section, index) => (

                      <div
                        className="generated-section"
                        key={section}
                      >

                        <span className="section-number">
                          {String(
                            index + 1
                          ).padStart(2, '0')}
                        </span>

                        <div>

                          <strong>
                            {section}
                          </strong>

                          <p>
                            {section} analysis is included
                            in this report.
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            ) : (

              <div className="preview-placeholder">

                <span>
                  REPORT CONTENT
                </span>

                <strong>
                  {selectedSections.length}{' '}
                  sections selected
                </strong>

                <p>
                  Generate the report to prepare the
                  selected analysis sections for export.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ===================================================
          TOAST
      =================================================== */}

      {toastMessage && (

        <div className="export-toast">

          <span className="toast-dot"></span>

          {toastMessage}

          <button
            onClick={() =>
              setToastMessage('')
            }
            aria-label="Close notification"
          >
            ×
          </button>

        </div>

      )}

    </section>
  )
}

export default ExportReportPage