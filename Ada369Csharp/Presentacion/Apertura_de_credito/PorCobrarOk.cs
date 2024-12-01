using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Ada369Csharp.Datos;
using Ada369Csharp.Logica;
namespace Ada369Csharp.Presentacion.Apertura_de_credito
{
    public partial class PorCobrarOk : Form
    {
        public PorCobrarOk()
        {
            InitializeComponent();
        }
        int idcliente;
        string estado;
        string saldo;
        Panel p = new Panel();
        //Crud------
        private void insertarCreditos()
        {
            if (!buscar_credito_activo(idcliente))
            {
                LcreditoPorCobrar parametros = new LcreditoPorCobrar();
                Insertar_datos funcion = new Insertar_datos();
                parametros.Descripcion = txtdetalle.Text;
                parametros.Fecha_registro = txtfechadeventa.Value;
                parametros.Fecha_vencimiento = txtfecha_de_pago.Value;
                parametros.Total = Convert.ToDouble(txtsaldo.Text);
                parametros.Saldo = Convert.ToDouble(txtsaldo.Text);
                parametros.Id_cliente = idcliente;
                if (funcion.insertar_CreditoPorCobrar(parametros) == true)
                {
                    MessageBox.Show("Registrado");
                    limpiar();
                    buscar_clientes();

                }
            } 
            else 
            {

                MessageBox.Show($"El cliente tiene un crédito activo de ${saldo}. Liquidar el crédito antes de solicitar otro.");

            }

        }

        private void buscar_clientes()
        {
            DataTable dt = new DataTable();
            Obtener_datos.buscar_clientes(ref dt, txtcliente.Text);
            datalistado.DataSource = dt;
            datalistado.Columns[1].Visible = false;
            datalistado.Columns[3].Visible = false;
            datalistado.Columns[4].Visible = false;
            datalistado.Columns[5].Visible = false;
            datalistado.Columns[6].Visible = false;
            datalistado.Columns[7].Visible = false;
            dibujarPanel();
        }

        private bool buscar_credito_activo(int idcliente)
        {
            bool creditoActivo = false;
            DataTable dt = new DataTable();
            Obtener_datos.BuscarCreditoActivo(ref dt, idcliente);
            foreach (DataRow row in dt.Rows)
            {
                string estado = row["Estado"].ToString();
                saldo = row["Saldo"].ToString();
                if (estado.Equals("DEBE"))
                {
                    creditoActivo = true;
                }
            }
            return creditoActivo;
           
        }

        //----------
        private void dibujarPanel()
        {
            datalistado.Dock = DockStyle.Fill;
            datalistado.Visible = true;
            p.Controls.Add(datalistado);
            p.Location = new Point(panelcorrdenadas.Location.X, panelcorrdenadas.Location.Y + panelproveedor.Location.Y);
            p.Size = new System.Drawing.Size(437, 248);
            Controls.Add(p);
            p.BringToFront();
        }
        private void limpiar()
        {
            txtsaldo.Clear();
            txtdetalle.Clear();
            idcliente = 0;
            txtcliente.Clear();
        }

        private void PorCobrarOk_Load(object sender, EventArgs e)
        {
            buscar_clientes();

        }

        private void txtcliente_TextChanged(object sender, EventArgs e)
        {
            buscar_clientes();
        }

        private void btnRegistrar_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtsaldo.Text))
            {
                rellenarCamposVacios();
                insertarCreditos();
            }
            else
            {
                MessageBox.Show("Ingrese un saldo");
            }
        }
        private void rellenarCamposVacios()
        {
            if (string.IsNullOrEmpty(txtdetalle.Text)) { txtdetalle.Text = "-"; }
        }

        private void btnagregar_Click(object sender, EventArgs e)
        {
            CLIENTES_PROVEEDORES.ClientesOk frm = new CLIENTES_PROVEEDORES.ClientesOk();
            frm.ShowDialog();
        }

        private void datalistado_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            idcliente  = Convert.ToInt32(datalistado.SelectedCells[1].Value);
            txtcliente.Text = datalistado.SelectedCells[2].Value.ToString();
            Controls.Remove(p);
        }

        private void txtcliente_Click(object sender, EventArgs e)
        {
            txtcliente.SelectAll();
        }

        private void txtsaldo_KeyPress(object sender, KeyPressEventArgs e)
        {
            Bases.Separador_de_Numeros(txtsaldo, e);

        }
    }
}
