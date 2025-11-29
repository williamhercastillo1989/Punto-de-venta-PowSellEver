using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using PowSellEver.Datos;
namespace PowSellEver.Presentacion.REPORTES
{
    public partial class MenuReportes : Form
    {
        public MenuReportes()
        {
            InitializeComponent();
        }
        int idusuario;
        private void MenuReportes_Load(object sender, EventArgs e)
        {
            PanelBienvenida.Visible = true;
            PanelBienvenida.Dock = DockStyle.Fill;
        }

        private void btnVentas_Click(object sender, EventArgs e)
        {
            panelVentas.Visible = true;
            panelVentas.Dock = DockStyle.Fill;
            PanelBienvenida.Visible = false;
            PanelProductos.Visible = false;
            PanelPorCobrarPagar.Visible = false;
            //--------------Paneles
            panel6.Enabled = false;
            PanelEmpleado.Visible = false;
            //Botones
            btnVentas.BackColor = Color.White;
            btnVentas.ForeColor = Color.OrangeRed;
            btnCobrar.BackColor = Color.FromArgb(242, 243, 244);
            btnCobrar.ForeColor = Color.FromArgb(64, 64, 64);
            BtnPagar.ForeColor = Color.FromArgb(64, 64, 64);
            BtnPagar.BackColor = Color.FromArgb(242, 243, 244);
            BtnProductos.ForeColor = Color.FromArgb(64, 64, 64);
            BtnProductos.BackColor = Color.FromArgb(242, 243, 244);
            //Controles internos
            chekFiltros.Checked = false;
            PanelFiltros.Visible = false;
        }

        private void btnResumenVentas_Click(object sender, EventArgs e)
        {
            panel6.Enabled = true;
            btnResumenVentas.ForeColor = Color.OrangeRed;
            btnEmpleado.ForeColor = Color.DimGray;
            PResumenVentas.Visible = true;
            PVentasPorempleado.Visible = false;    
            btnHoy.ForeColor = Color.OrangeRed;
            PanelEmpleado.Visible = false;
            chekFiltros.Checked = false;
            PanelFiltros.Visible = false;
            TFILTROS.ForeColor = Color.DimGray;
            ReporteResumenVentasHoy();
        }
        private void ReporteResumenVentasHoy()
        {
            try
            {
                DataTable dt = new DataTable();
                Obtener_datos.ReporteResumenVentasHoy(ref dt);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos("No hay ventas registradas para hoy.");
                    return;
                }

                ReporteVentas.ResumenVentas rpt = new ReporteVentas.ResumenVentas();
                ReportHelper.MostrarReporte(reportViewer1, rpt, dt, "table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }

        private void btnHoy_Click(object sender, EventArgs e)
        {
            if (PResumenVentas.Visible == true)
            {
                ReporteResumenVentasHoy();
            }
            if (PVentasPorempleado.Visible == true)
            {
                ReporteResumenVentasHoyEmpleado();

            }
            btnHoy.ForeColor = Color.OrangeRed;
            chekFiltros.Checked = false;
            PanelFiltros.Visible = false;          
            TFILTROS.ForeColor = Color.DimGray;
        }

        private void chekFiltros_CheckedChanged(object sender, EventArgs e)
        {
            if (chekFiltros.Checked==true)
            {
                if (PResumenVentas.Visible==true)
                {
                    ReporteResumenVentasFechas();
                }
                if (PVentasPorempleado.Visible==true)
                {
                    ReporteResumenVentasEmpleadoFechas();
                }
                btnHoy.ForeColor = Color.DimGray;
                PanelFiltros.Visible = true;
                TFILTROS.ForeColor = Color.OrangeRed;
            }
            else
            {
                if (PResumenVentas.Visible == true)
                {
                    ReporteResumenVentasHoy();
                }
                if (PVentasPorempleado.Visible == true)
                {
                    ReporteResumenVentasHoyEmpleado();
                }
                btnHoy.ForeColor = Color.OrangeRed;
                PanelFiltros.Visible = false;
                TFILTROS.ForeColor = Color.DimGray;

            }
        }
        private void ReporteResumenVentasFechas()
        {
            try
            {
                // Validar que la fecha inicial sea menor o igual a la fecha final
                if (TXTFI.Value > TXTFF.Value)
                {
                    MessageBox.Show("La fecha inicial no puede ser mayor que la fecha final.", 
                        "Error de validación", 
                        MessageBoxButtons.OK, 
                        MessageBoxIcon.Warning);
                    return;
                }

                DataTable dt = new DataTable();
                Obtener_datos.ReporteResumenVentasFechas(ref dt, TXTFI.Value, TXTFF.Value);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos($"No hay ventas registradas entre {TXTFI.Value:dd/MM/yyyy} y {TXTFF.Value:dd/MM/yyyy}.");
                    return;
                }

                ReporteVentas.ResumenVentas rpt = new ReporteVentas.ResumenVentas();
                ReportHelper.MostrarReporte(reportViewer1, rpt, dt, "table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }

        private void btnEmpleado_Click(object sender, EventArgs e)
        {
            panel6.Enabled = true;
            btnResumenVentas.ForeColor = Color.DimGray;
            btnEmpleado.ForeColor = Color.OrangeRed;
            PResumenVentas.Visible = false;
            PVentasPorempleado.Visible = true;
            btnHoy.ForeColor = Color.OrangeRed;
       
            chekFiltros.Checked = false;
            PanelFiltros.Visible = false;
            TFILTROS.ForeColor = Color.DimGray;
            PanelEmpleado.Visible = true;
            mostrarUsuarios();
            ReporteResumenVentasHoyEmpleado();
        }
        private void ReporteResumenVentasHoyEmpleado()
        {
            try
            {
                if (idusuario <= 0)
                {
                    MessageBox.Show("Por favor seleccione un empleado.", 
                        "Validación", 
                        MessageBoxButtons.OK, 
                        MessageBoxIcon.Warning);
                    return;
                }

                DataTable dt = new DataTable();
                Obtener_datos.ReporteResumenVentasHoyEmpleado(ref dt, idusuario);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos("No hay ventas registradas para este empleado hoy.");
                    return;
                }

                ReporteVentas.ResumenVentas rpt = new ReporteVentas.ResumenVentas();
                ReportHelper.MostrarReporte(reportViewer1, rpt, dt, "table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }
        private void ReporteResumenVentasEmpleadoFechas()
        {
            try
            {
                if (idusuario <= 0)
                {
                    MessageBox.Show("Por favor seleccione un empleado.", 
                        "Validación", 
                        MessageBoxButtons.OK, 
                        MessageBoxIcon.Warning);
                    return;
                }

                // Validar que la fecha inicial sea menor o igual a la fecha final
                if (TXTFI.Value > TXTFF.Value)
                {
                    MessageBox.Show("La fecha inicial no puede ser mayor que la fecha final.", 
                        "Error de validación", 
                        MessageBoxButtons.OK, 
                        MessageBoxIcon.Warning);
                    return;
                }

                DataTable dt = new DataTable();
                Obtener_datos.ReporteResumenVentasEmpleadoFechas(ref dt, idusuario, TXTFI.Value, TXTFF.Value);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos($"No hay ventas registradas para este empleado entre {TXTFI.Value:dd/MM/yyyy} y {TXTFF.Value:dd/MM/yyyy}.");
                    return;
                }

                ReporteVentas.ResumenVentas rpt = new ReporteVentas.ResumenVentas();
                ReportHelper.MostrarReporte(reportViewer1, rpt, dt, "table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }
        private void mostrarUsuarios()
        {
            DataTable dt = new DataTable();
            Obtener_datos.mostrarUsuarios(ref dt);
            txtEmpleado.DisplayMember = "Nombres_y_Apellidos";
            txtEmpleado.ValueMember = "idUsuario";
            txtEmpleado.DataSource = dt;

        }

        private void txtEmpleado_SelectedIndexChanged(object sender, EventArgs e)
        {
            idusuario =Convert.ToInt32 ( txtEmpleado.SelectedValue);
            if (chekFiltros.Checked==true )
            {
                ReporteResumenVentasEmpleadoFechas();
            }
            else

            {
                ReporteResumenVentasHoyEmpleado();
            }

        }

        private void TXTFI_ValueChanged(object sender, EventArgs e)
        {
            validarFiltros();
        }

        private void TXTFF_ValueChanged(object sender, EventArgs e)
        {
            validarFiltros();
        }
        private void validarFiltros()
        {
        if (chekFiltros.Checked == true)
            {
                if (PResumenVentas.Visible == true)
                {
                    ReporteResumenVentasFechas();
                }
                if (PVentasPorempleado.Visible == true)
                {
                    ReporteResumenVentasEmpleadoFechas();
                }
            }
        }

        private void btnCobrar_Click(object sender, EventArgs e)
        {
            panelVentas.Visible = false;
            PanelBienvenida.Visible = false;
            PanelProductos.Visible = false;
            PanelPorCobrarPagar.Visible = true;
            PanelPorCobrarPagar.Dock = DockStyle.Fill;
            //Botones
            btnVentas.BackColor = Color.FromArgb(242, 243, 244);
            btnVentas.ForeColor = Color.FromArgb(64, 64, 64);
            btnCobrar.BackColor = Color.White;
            btnCobrar.ForeColor = Color.OrangeRed;
            BtnPagar.ForeColor = Color.FromArgb(64, 64, 64);
            BtnPagar.BackColor = Color.FromArgb(242, 243, 244);
            BtnProductos.ForeColor = Color.FromArgb(64, 64, 64);
            BtnProductos.BackColor = Color.FromArgb(242, 243, 244);
            ReporteCuestasPorCobrar();
        }
        private void ReporteCuestasPorCobrar()
        {
            try
            {
                DataTable dt = new DataTable();
                Obtener_datos.ReporteCuestasPorCobrar(ref dt);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos("No hay cuentas por cobrar registradas.");
                    return;
                }

                ReportePorCobrar.ReporteCobrar rpt = new ReportePorCobrar.ReporteCobrar();
                ReportHelper.MostrarReporte(reportViewer2, rpt, dt, "Table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }

        private void BtnPagar_Click(object sender, EventArgs e)
        {
            panelVentas.Visible = false;
            PanelBienvenida.Visible = false;
            PanelProductos.Visible = false;
            PanelPorCobrarPagar.Visible = true;
            PanelPorCobrarPagar.Dock = DockStyle.Fill;
            //Botones
            btnVentas.BackColor = Color.FromArgb(242, 243, 244);
            btnVentas.ForeColor = Color.FromArgb(64, 64, 64);
            btnCobrar.BackColor = Color.FromArgb(242, 243, 244);
            btnCobrar.ForeColor = Color.FromArgb(64, 64, 64);
            BtnPagar.ForeColor = Color.OrangeRed;
            BtnPagar.BackColor = Color.White;
            BtnProductos.ForeColor = Color.FromArgb(64, 64, 64);
            BtnProductos.BackColor = Color.FromArgb(242, 243, 244);
            ReporteCuestasPorPagar();
        }
        private void ReporteCuestasPorPagar()
        {
            try
            {
                DataTable dt = new DataTable();
                Obtener_datos.ReporteCuestasPorPagar(ref dt);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos("No hay cuentas por pagar registradas.");
                    return;
                }

                ReportePorPagar.ReportePagar rpt = new ReportePorPagar.ReportePagar();
                ReportHelper.MostrarReporte(reportViewer2, rpt, dt, "Table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }

        private void BtnProductos_Click(object sender, EventArgs e)
        {
            panelVentas.Visible = false;
            PanelBienvenida.Visible = false;
            PanelProductos.Visible = true;
            PanelProductos.Dock = DockStyle.Fill;
            PanelPorCobrarPagar.Visible = false;
            //Botones
            btnVentas.BackColor = Color.FromArgb(242, 243, 244);
            btnVentas.ForeColor = Color.FromArgb(64, 64, 64);
            btnCobrar.BackColor = Color.FromArgb(242, 243, 244);
            btnCobrar.ForeColor = Color.FromArgb(64, 64, 64);
            BtnPagar.ForeColor = Color.FromArgb(64, 64, 64);
            BtnPagar.BackColor = Color.FromArgb(242, 243, 244);
            BtnProductos.ForeColor = Color.OrangeRed;
            BtnProductos.BackColor = Color.White;
            //Paneles
            PInventarios.Visible = false;
            Pvencidos.Visible = false;
            PStockBajo.Visible = false;
            ReportViewer3.Visible = false;
        }

        private void btnInventarios_Click(object sender, EventArgs e)
        {
            PInventarios.Visible = true;
            PStockBajo.Visible = false;
            Pvencidos.Visible = false;
            ReportViewer3.Visible = true;
            imprimir_inventarios_todos();
        }
        private void imprimir_inventarios_todos()
        {
            try
            {
                DataTable dt = new DataTable();
                Obtener_datos.imprimir_inventarios_todos(ref dt);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos("No hay inventarios registrados.");
                    return;
                }

                REPORTES_DE_KARDEX_listo.REPORTES_DE_INVENTARIOS_todos.ReportInventarios_Todos rpt = 
                    new REPORTES_DE_KARDEX_listo.REPORTES_DE_INVENTARIOS_todos.ReportInventarios_Todos();
                ReportHelper.MostrarReporte(ReportViewer3, rpt, dt, "table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }

        private void btnPvencidos_Click(object sender, EventArgs e)
        {
            PInventarios.Visible = false;
            PStockBajo.Visible = false;
            Pvencidos.Visible = true;
            ReportViewer3.Visible = true;
            mostrar_productos_vencidos();
        }
        private void mostrar_productos_vencidos()
        {
            try
            {
                DataTable dt = new DataTable();
                Obtener_datos.mostrar_productos_vencidos(ref dt);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos("No hay productos vencidos registrados.");
                    return;
                }

                REPORTES_DE_KARDEX_listo.REPORTES_DE_INVENTARIOS_todos.ReportePVencidos rpt = 
                    new REPORTES_DE_KARDEX_listo.REPORTES_DE_INVENTARIOS_todos.ReportePVencidos();
                ReportHelper.MostrarReporte(ReportViewer3, rpt, dt, "table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }

        private void btnStockBajo_Click(object sender, EventArgs e)
        {
            PInventarios.Visible = false;
            PStockBajo.Visible = true;
            Pvencidos.Visible = false;
            ReportViewer3.Visible = true;
            mostrarProdctosMinimo();
        }
        private void mostrarProdctosMinimo()
        {
            try
            {
                DataTable dt = new DataTable();
                Obtener_datos.MOSTRAR_Inventarios_bajo_minimo(ref dt);
                
                if (!ReportHelper.ValidarDatos(dt))
                {
                    ReportHelper.MostrarMensajeSinDatos("No hay productos con stock bajo el mínimo registrados.");
                    return;
                }

                REPORTES_DE_KARDEX_listo.REPORTES_DE_INVENTARIOS_todos.ReportePbajomin rpt = 
                    new REPORTES_DE_KARDEX_listo.REPORTES_DE_INVENTARIOS_todos.ReportePbajomin();
                ReportHelper.MostrarReporte(ReportViewer3, rpt, dt, "table1");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el reporte: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }
    }

}
