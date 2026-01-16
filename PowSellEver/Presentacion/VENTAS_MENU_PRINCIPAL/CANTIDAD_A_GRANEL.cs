using PowSellEver.Datos;
using PowSellEver.Logica;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PowSellEver.Presentacion.VENTAS_MENU_PRINCIPAL
{
    public partial class CANTIDAD_A_GRANEL : Form
    {
        public CANTIDAD_A_GRANEL()
        {
            InitializeComponent();
        }
        private string BufeerRespuesta;
        private delegate void DelegadoAcceso(string accion);
        public  double preciounitario;
        string puertoBalanza;
        string estadoPuerto;
        private void AccesoForm(string accion)
        {
            BufeerRespuesta = accion;
            string result = BufeerRespuesta.Remove(BufeerRespuesta.Length - 3);
            txtcantidad.Text = result.Trim();
        }
        private void accesoInterrupcion(string accion)
        {
            DelegadoAcceso Var_delagadoacceso;
            Var_delagadoacceso = new DelegadoAcceso(AccesoForm);
            Object[] arg = { accion };
            base.BeginInvoke(Var_delagadoacceso, arg);
        }
        private void puertos_DataReceived(Object sender, SerialDataReceivedEventArgs e)
        {
            accesoInterrupcion(puertos.ReadExisting());
        }

     

        private void CANTIDAD_A_GRANEL_Load(object sender, EventArgs e)
        {
            txtprecio_unitario.Text = Convert.ToString(preciounitario);
            mostrarPuertos();
        }


        private void abrirPuertosBalanza()
        {
            puertos.Close();
            try
            {


          
                puertos = new SerialPort(puertoBalanza, 9600, Parity.None, 8, StopBits.One);
                puertos.Handshake = Handshake.None;
                puertos.ReadTimeout = 1000;
                puertos.WriteTimeout = 1000;
                puertos.DataReceived += puertos_DataReceived;
               
                puertos.Open();
                puertos.Write("P");
                if (puertos.IsOpen)
                {
                    estadoPuerto = "Conectado";
                }
                else
                {
                    estadoPuerto = "Fallo la conexion";
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void mostrarPuertos()
        {
            DataTable dt = new DataTable();
            Obtener_datos.mostrarPuertos(ref dt);
            foreach (DataRow rdr in dt.Rows)
            {
                puertoBalanza = rdr["PuertoBalanza"].ToString();
                estadoPuerto = rdr["EstadoBalanza"].ToString();
            }
            MessageBox.Show(estadoPuerto);
            if (estadoPuerto == "CONFIRMADO")
            {
                timerWeight.Start();
            }
        }

        private void txtcantidad_TextChanged(object sender, EventArgs e)
        {
            calcularTotal();
        }
        private void calcularTotal()
        {
            try
            {
            double total;
            double cantidad;
            cantidad =Convert.ToDouble ( txtcantidad.Text);
            total = preciounitario * cantidad;
            txttotal.Text =Convert.ToString ( total);
            }
            catch (Exception)
            {

            }
            
        }

        private void txtcantidad_KeyPress(object sender, KeyPressEventArgs e)
        {
            Bases.Separador_de_Numeros(txtcantidad, e);
        }

        private void txttotal_KeyPress(object sender, KeyPressEventArgs e)
        {
            Bases.Separador_de_Numeros(txttotal, e);

        }

        private void CANTIDAD_A_GRANEL_FormClosed(object sender, FormClosedEventArgs e)
        {
            puertos.Close();
            timerWeight.Stop();
            VENTAS_MENU_PRINCIPALOK.txtpantalla = Convert.ToDouble("0");
            Dispose();
        }

        private void timerWeight_Tick(object sender, EventArgs e)
        {
            abrirPuertosBalanza();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Dispose();
        }

        private void BtnAgregar_Agranel_Click(object sender, EventArgs e)
        {
            VENTAS_MENU_PRINCIPALOK.txtpantalla = Convert.ToDouble(txtcantidad.Text);
            Dispose();
        }
    }
}
