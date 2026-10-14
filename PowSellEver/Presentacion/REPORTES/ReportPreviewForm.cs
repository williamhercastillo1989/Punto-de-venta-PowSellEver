using System;
using System.Windows.Forms;
using Telerik.ReportViewer.WinForms;
using Telerik.Reporting;

namespace PowSellEver.Presentacion.REPORTES
{
    public class ReportPreviewForm : Form
    {
        private readonly ReportViewer _viewer;

        public ReportPreviewForm()
        {
            Text = "Vista previa del reporte";
            StartPosition = FormStartPosition.CenterScreen;
            WindowState = FormWindowState.Maximized;
            _viewer = new ReportViewer
            {
                Dock = DockStyle.Fill,
                ViewMode = ViewMode.PrintPreview
            };
            Controls.Add(_viewer);
        }

        public void LoadReport(Report report)
        {
            if (report == null) throw new ArgumentNullException(nameof(report));
            _viewer.Report = report;
            _viewer.RefreshReport();
        }
    }
}

