using System;
using System.Data;
using System.Windows.Forms;
using Telerik.ReportViewer.WinForms;
using Telerik.Reporting;

namespace PowSellEver.Presentacion.REPORTES
{
    /// <summary>
    /// Clase helper para manejar la generación y visualización de reportes
    /// Reduce la duplicación de código y centraliza la lógica de reportes
    /// </summary>
    public static class ReportHelper
    {
        /// <summary>
        /// Muestra un reporte en el viewer especificado
        /// </summary>
        /// <param name="viewer">El control ReportViewer donde se mostrará el reporte</param>
        /// <param name="report">El reporte de Telerik a mostrar</param>
        /// <param name="dataTable">Los datos para el reporte</param>
        /// <param name="tableName">Nombre de la tabla en el reporte (opcional)</param>
        public static void MostrarReporte(ReportViewer viewer, Report report, DataTable dataTable, string tableName = "table1")
        {
            try
            {
                if (viewer == null)
                {
                    throw new ArgumentNullException(nameof(viewer), "El viewer no puede ser nulo");
                }

                if (report == null)
                {
                    throw new ArgumentNullException(nameof(report), "El reporte no puede ser nulo");
                }

                if (dataTable == null)
                {
                    throw new ArgumentNullException(nameof(dataTable), "Los datos no pueden ser nulos");
                }

                // Asignar datos al reporte
                report.DataSource = dataTable;

                // Intentar asignar datos a la tabla específica si existe
                try
                {
                    var tableProperty = report.GetType().GetProperty(tableName);
                    if (tableProperty != null)
                    {
                        var table = tableProperty.GetValue(report);
                        if (table != null)
                        {
                            var dataSourceProperty = table.GetType().GetProperty("DataSource");
                            dataSourceProperty?.SetValue(table, dataTable);
                        }
                    }
                }
                catch
                {
                    // Si no se puede asignar a la tabla específica, continuar con DataSource general
                }

                // Mostrar el reporte en el viewer
                viewer.Report = report;
                viewer.RefreshReport();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al mostrar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Valida que un DataTable tenga datos antes de mostrar el reporte
        /// </summary>
        /// <param name="dataTable">El DataTable a validar</param>
        /// <returns>True si tiene datos, False si está vacío</returns>
        public static bool ValidarDatos(DataTable dataTable)
        {
            return dataTable != null && dataTable.Rows.Count > 0;
        }

        /// <summary>
        /// Muestra un mensaje si no hay datos para el reporte
        /// </summary>
        /// <param name="mensaje">Mensaje personalizado (opcional)</param>
        public static void MostrarMensajeSinDatos(string mensaje = "No hay datos disponibles para mostrar en el reporte.")
        {
            MessageBox.Show(mensaje, 
                "Sin datos", 
                MessageBoxButtons.OK, 
                MessageBoxIcon.Information);
        }
    }
}

