using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;
using System.IO;
using System.Net.Mail;
using System.Net;
using System.Management;
using System.Xml;
using Ada369Csharp.Logica;
using Ada369Csharp.Datos;
namespace Ada369Csharp.Presentacion.CAJA
{
    public partial class APERTURA_DE_CAJA : Form
    {
        public APERTURA_DE_CAJA()
        {
            InitializeComponent();
        }
        int txtidcaja;
        int idusuariovariable;
        private void ToolStripMenuItem2_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty (txtmonto.Text ))
            {
                txtmonto.Text = "0";
            }
            bool  estado = Editar_datos.editar_dinero_caja_inicial(txtidcaja, Convert.ToDouble(txtmonto.Text));
            if (estado ==true )
            {
                aperturar_detalle_de_cierre_caja();
                pasar_a_ventas();
            }       
        }

  
        private void APERTURA_DE_CAJA_Load(object sender, EventArgs e)
        {
            Bases.Cambiar_idioma_regional();
            Obtener_datos.Obtener_id_caja_PorSerial(ref txtidcaja);
            Obtener_datos.mostrar_inicio_De_sesion(ref idusuariovariable);
            centrar_panel();
        }
        private void centrar_panel()
        {
            PanelCaja.Location = new Point((Width - PanelCaja.Width) / 2, (Height - PanelCaja.Height) / 2);
        }

        private void btnomitir_Click(object sender, EventArgs e)
        {
            pasar_a_ventas();
        }
        private void pasar_a_ventas()
        {
            Dispose();
            VENTAS_MENU_PRINCIPAL.VENTAS_MENU_PRINCIPALOK frm = new VENTAS_MENU_PRINCIPAL.VENTAS_MENU_PRINCIPALOK();
            frm.ShowDialog();
           
        }

        private void txtmonto_KeyPress(object sender, KeyPressEventArgs e)
        {
            Bases.Separador_de_Numeros(txtmonto, e);

        }

        private void txtmonto_TextChanged(object sender, EventArgs e)
        {

        }
        private void aperturar_detalle_de_cierre_caja()
        {
            try
            {



                SqlConnection con = new SqlConnection();
                con.ConnectionString = CONEXION.CONEXIONMAESTRA.conexion;
                con.Open();
                SqlCommand cmd = new SqlCommand();
                cmd = new SqlCommand("insertar_DETALLE_cierre_de_caja", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@fechaini", DateTime.Now);
                cmd.Parameters.AddWithValue("@fechafin", DateTime.Now);
                //cmd.Parameters.AddWithValue("@fecha", DateTime.Today);

                cmd.Parameters.AddWithValue("@fechacierre", DateTime.Now);
                cmd.Parameters.AddWithValue("@ingresos", "0.00");
                cmd.Parameters.AddWithValue("@egresos", "0.00");
                cmd.Parameters.AddWithValue("@saldo", "0.00");
                cmd.Parameters.AddWithValue("@idusuario", idusuariovariable);
                cmd.Parameters.AddWithValue("@totalcaluclado", "0.00");
                cmd.Parameters.AddWithValue("@totalreal", "0.00");

                cmd.Parameters.AddWithValue("@estado", "CAJA APERTURADA");
                cmd.Parameters.AddWithValue("@diferencia", "0.00");
                cmd.Parameters.AddWithValue("@id_caja", txtidcaja);

                cmd.ExecuteNonQuery();
                con.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}
