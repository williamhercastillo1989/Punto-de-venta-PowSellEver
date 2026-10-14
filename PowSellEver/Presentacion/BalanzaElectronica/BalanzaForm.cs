using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using PowSellEver.Datos;
using PowSellEver.Logica;
namespace PowSellEver.Presentacion.BalanzaElectronica
{
    public partial class BalanzaForm : Form
    {
        public BalanzaForm()
        {
            InitializeComponent();
        }

        private string BufeerRespuesta;
        private delegate void DelegadoAcceso(string accion);
        string estadoPuerto;
        private void AccesoForm(string accion)
        {
            BufeerRespuesta = accion;
            string result = BufeerRespuesta.Remove(BufeerRespuesta.Length - 3);
            txtresultado.Text = result;
        }

     

        private void accesoInterrupcion(string accion)
        {
            DelegadoAcceso Var_delagadoacceso;
            Var_delagadoacceso = new DelegadoAcceso(AccesoForm);
            Object[] arg = { accion };
            base.Invoke(Var_delagadoacceso, arg);
        }

        private void puertos_DataReceived(Object sender, SerialDataReceivedEventArgs e)
        {

            SerialPort sp = (SerialPort)sender;
            string indata = sp.ReadExisting();
            Console.WriteLine("Data Received:");
            Console.Write(indata);

            accesoInterrupcion(puertos.ReadExisting());
        }

        private void BalanzaForm_Load(object sender, EventArgs e)
        {
            listarPuertos();

            DataTable dt = new DataTable();
            Obtener_datos.mostrarPuertos(ref dt);
            foreach (DataRow rdr in dt.Rows)
            {
      
                estadoPuerto = rdr["EstadoBalanza"].ToString();
            }

            if (estadoPuerto == "CONFIRMADO")
            {
                timerWeight.Start();
            }
            
        }

        private void listarPuertos()
        {
            try
            {
                ListaPuertos.Items.Clear();
                string[] PuertosDisponibles = SerialPort.GetPortNames();
                foreach (string puerto in PuertosDisponibles)
                {
                    ListaPuertos.Items.Add(puerto);

                }
                if (ListaPuertos.Items.Count >0)
                {
                    ListaPuertos.SelectedIndex = 0;
                }
                else
                {
                    MessageBox.Show("No se encontraron Puertos");

                }

            }
            catch (Exception ex)
            {
                MessageBox.Show("No se encontraron Puertos");
            }
        }



        private void executePeso()
        {
            puertos.Close();


            try
            {

                puertos = new SerialPort(ListaPuertos.Text, 9600, Parity.None, 8, StopBits.One);
                puertos.Handshake = Handshake.None;
                puertos.ReadTimeout = 1000;
                puertos.WriteTimeout = 1000;
                puertos.DataReceived += puertos_DataReceived_1;
                puertos.Open();
                puertos.Write("P");

                if (puertos.IsOpen)
                {
                    lblestado.Text = "Conectado";
                }
                else
                {
                    MessageBox.Show("Fallo la conexion");

                }



            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.StackTrace);
            }
        }

        private void btnProbar_Click(object sender, EventArgs e)
        {

            puertos.Close();
            timerWeight.Stop();

            try
            {

                puertos = new SerialPort(ListaPuertos.Text, 9600, Parity.None, 8, StopBits.One);
                puertos.Handshake = Handshake.None;
                puertos.ReadTimeout = 1000;
                puertos.WriteTimeout = 1000;
                puertos.DataReceived += puertos_DataReceived_1;
                puertos.Open();
                puertos.Write("P");

                if (puertos.IsOpen)
                {
                    timerWeight.Start();
                    lblestado.Text = "Conectado";
                }
                else
                {
                    MessageBox.Show("Fallo la conexion");

                }



            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.StackTrace);
            }
        }

        private void btnenviar_Click(object sender, EventArgs e)
        {
            if (puertos.IsOpen)
            {
                puertos.WriteLine(txtresultado.Text);
            }
            else
            {
                MessageBox.Show("Fallo la conexion");
            }
        }

        private void btnguardar_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtresultado.Text ))
            {
              editarBascula();
            }
            else
            {
                MessageBox.Show("El resultado tiene que ser diferente de vacio para confirmar la balanza");
            }
          
        }


        private void editarBascula()
        {
            Lcaja parametros = new Lcaja();
            Editar_datos funcion = new Editar_datos();
            parametros.EstadoBalanza = "CONFIRMADO";
            parametros.PuertoBalanza = ListaPuertos.Text;
            if (funcion.EditarBascula(parametros)==true)
            {
                MessageBox.Show("Balanza configurada y guardada correctamente");
            }
        }


        private void BalanzaForm_FormClosed(object sender, FormClosedEventArgs e)
        {
            puertos.Close();
            timerWeight.Stop();
        }

      
        private void puertos_DataReceived_1(object sender, SerialDataReceivedEventArgs e)
        {
        
            accesoInterrupcion(puertos.ReadExisting());
        }

        private void timerWeight_Tick(object sender, EventArgs e)
        {
            executePeso();
        }
    }
}
