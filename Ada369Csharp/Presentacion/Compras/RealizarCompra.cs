﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using Ada369Csharp.Datos;
using Ada369Csharp.Logica;
using Ada369Csharp.Presentacion.CLIENTES_PROVEEDORES;
using System.Data.SqlClient;
using System.Runtime.InteropServices;

namespace Ada369Csharp.Presentacion.Compras
{
    public partial class RealizarCompra : UserControl
    {
        public RealizarCompra()
        {
            InitializeComponent();
        }
        string estadocompra;
        int idproducto;
        Panel panel_mostrador_de_productos = new Panel();
        string Tipo_de_busqueda;
        public static int idcompra = 0;
        int idproveedor;
        string sevendePor;
        double txtpantalla;
        int iddetallecompra;
        bool SECUENCIA = true;
        public static bool ESTADO_EDICION = false;

        private void txtbuscar_TextChanged(object sender, EventArgs e)
        {

            if (Tipo_de_busqueda == "LECTORA")
            {
                lbltipodebusqueda2.Visible = false;
                TimerBUSCADORcodigodebarras.Start();
            }
            else if (Tipo_de_busqueda == "TECLADO")
            {
                if (txtbuscar.Text == "")
                {
                    ocultar_mostrar_productos();
                }
                else
                {
                    mostrar_productos();
                }
                BuscarProductos();
            }
          
        }

        private void ValidarTiposBusqueda()
        {
            MOSTRAR_TIPO_DE_BUSQUEDA();
            if (Tipo_de_busqueda == "TECLADO")
            {
                lbltipodebusqueda2.Text = "Buscar con TECLADO";
                BTNLECTORA.BackColor = Color.WhiteSmoke;
                btnteclado.BackColor = Color.LightGreen;
                txtbuscar.Clear();
                txtbuscar.Focus();
            }
            else
            {
                lbltipodebusqueda2.Text = "Buscar con LECTORA de Codigos de Barras";
                BTNLECTORA.BackColor = Color.LightGreen;
                btnteclado.BackColor = Color.WhiteSmoke;
                txtbuscar.Focus();
                txtbuscar.Clear();

            }
        }

       
        private void MOSTRAR_TIPO_DE_BUSQUEDA()
        {
            SqlConnection con = new SqlConnection();
            con.ConnectionString = CONEXION.CONEXIONMAESTRA.conexion;
            SqlCommand com = new SqlCommand("Select Modo_de_busqueda  from EMPRESA", con);

            try
            {
                con.Open();
                Tipo_de_busqueda = Convert.ToString(com.ExecuteScalar());
                con.Close();
            }
            catch (Exception)
            {
                //MessageBox.Show(ex.StackTrace);
            }
        }

        private void BuscarProductos()
        {
            var dt = new DataTable();
            var funcion = new Dproductos();
            funcion.buscarProductos(ref dt, txtbuscar.Text);
            dgProductos.DataSource = dt;
            dgProductos.Columns[0].Visible = false;
            dgProductos.Columns[1].Visible = false;
            dgProductos.Columns[2].Width = 600;
            dgProductos.Columns[3].Visible = false;
            dgProductos.Columns[4].Visible = false;
            dgProductos.Columns[5].Visible = false;
            dgProductos.Columns[6].Visible = false;
            dgProductos.Columns[7].Visible = false;
            dgProductos.Columns[8].Visible = false;
            dgProductos.Columns[9].Visible = false;
            dgProductos.Columns[10].Visible = false;

        }

        private void mostrar_productos()
        {
            panel_mostrador_de_productos.Size = new Size(600, 186);
            panel_mostrador_de_productos.BackColor = Color.White;
            panel_mostrador_de_productos.Location = new Point(panelReferenciaProductos.Location.X, panelReferenciaProductos.Location.Y);
            panel_mostrador_de_productos.Visible = true;
            dgProductos.Visible = true;
            dgProductos.Dock = DockStyle.Fill;
            dgProductos.BackgroundColor = Color.White;
            lbltipodebusqueda2.Visible = false;
            panel_mostrador_de_productos.Controls.Add(dgProductos);
            this.Controls.Add(panel_mostrador_de_productos);
            panel_mostrador_de_productos.BringToFront();
        }

        private void vender_por_lectora_de_barras()
        {
            try
            {
                if (txtbuscar.Text == "")
                {
                    dgProductos.Visible = false;
                    lbltipodebusqueda2.Visible = true;
                }
                if (txtbuscar.Text != "")
                {
                    dgProductos.Visible = true;
                    lbltipodebusqueda2.Visible = false;
                    BuscarProductos();

                    txtbuscar.Text = dgProductos.SelectedCells[9].Value.ToString();
                    idproducto = Convert.ToInt32(dgProductos.SelectedCells[1].Value);
                    panel_mostrador_de_productos.Visible = false;
                    insertarCompra();
                    txtbuscar.Text = "";
                    txtbuscar.Focus();
                }
            }
            catch (Exception)
            {


            }

        }

        private void ocultar_mostrar_productos()
        {
            panel_mostrador_de_productos.Visible = false;
            dgProductos.Visible = false;
            lbltipodebusqueda2.Visible = true;
        }

        private void RealizarCompra_Load(object sender, EventArgs e)
        {
            estadocompra = "COMPRA NUEVA";
            ValidarTiposBusqueda();
            dibujarProveedores();
            eliminarComprasvacias();
            
        }
        private void dibujarProveedores()
        {
            var funcion = new Dproveedores();
            DataTable dt = new DataTable();
            funcion.buscar_Proveedores(ref dt, txtBuscarproveedores.Text);
            FlowpanelProveedor.Controls.Clear();
            foreach(DataRow rdr in dt.Rows)
            {
                Button b = new Button();
                b.Size = new Size(149, 65);
                b.Text = rdr["Nombre"].ToString();
                b.Name = rdr["IdProveedor"].ToString();
                b.BackColor = Color.FromArgb(43, 43, 43);
                b.Font = new Font("Microsoft Sans Serif", 12);
                b.FlatStyle = FlatStyle.Flat;
                b.FlatAppearance.BorderSize = 0;
                b.ForeColor = Color.White;
                FlowpanelProveedor.Controls.Add(b);
                b.Click += B_Click;
            }

        }

        private void B_Click(object sender, EventArgs e)
        {
            idproveedor = Convert.ToInt32(((Button)sender).Name);
            //Deseleccionar
            foreach (Button b in FlowpanelProveedor.Controls)
            {
                if(b is Button)
                {
                    b.BackColor = Color.FromArgb(43, 43, 43);
                }
            }
            //Seleccionar button
            foreach(Button b2 in FlowpanelProveedor.Controls)
            {
                if (b2 is Button)
                {
                    if(b2.Name ==idproveedor.ToString())
                    {
                        b2.BackColor = Color.FromArgb(81, 175, 73);
                    }
                }
            }

        }

        private void txtBuscarproveedores_TextChanged(object sender, EventArgs e)
        {
            dibujarProveedores();
        }

        private void dgProductos_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            txtbuscar.Text = dgProductos.SelectedCells[9].Value.ToString();
            idproducto = Convert.ToInt32(dgProductos.SelectedCells[1].Value);
            panel_mostrador_de_productos.Visible = false;
            insertarCompra();
            txtbuscar.Text = "";
            txtbuscar.Focus();
        }
        private void insertarCompra()
        {
            var funcion = new Dcompras();
            var parametros = new Ldetallecompra();
            parametros.Estado = estadocompra;
            parametros.Cantidad = 1;
            parametros.Costo = 1;
            parametros.Moneda = "-";
            parametros.Descripcion = txtbuscar.Text;
            parametros.IdProducto = idproducto;
            if(funcion.Insertar_Compras(parametros)==true)
            {
                estadocompra = "COMPRA GENERADA";
                mostrarUltimoIdcompra();
                mostrarDetallecompra();
            }


        }
        private void eliminarComprasvacias()
        {
            var funcion = new Dcompras();
            funcion.eliminarComprasvacias();

        }
        private void mostrarUltimoIdcompra()
        {
            var funcion = new Dcompras();
            funcion.MostrarUltimoIdcompra(ref idcompra);
        }
        public  void mostrarDetallecompra()
        {
            var dt = new DataTable();
            var funcion = new Ddetallecompra();
            var parametros = new Ldetallecompra();
            parametros.IdCompra = idcompra;
            funcion.mostrar_DetalleCompra(ref dt, parametros);
            dgDetallecompra.DataSource = dt;
            dgDetallecompra.Columns[2].Visible = false;
            dgDetallecompra.Columns[3].Visible = false;
            dgDetallecompra.Columns[4].Visible = false;
            dgDetallecompra.Columns[8].Visible = false;
            dgDetallecompra.Columns[9].Visible = false;
            dgDetallecompra.Columns[10].Visible = false;
            Bases.Multilinea(ref dgDetallecompra);
            sumar();


        }
        private void sumar()
        {
            try
            {
                int x;
                x = dgDetallecompra.Rows.Count;
                if (x == 0)
                {
                    txt_total_suma.Text = "0.00";

                }
                double totalpagar;
                totalpagar = 0;
                foreach (DataGridViewRow fila in dgDetallecompra.Rows)
                {
                    totalpagar += Convert.ToDouble( fila.Cells["Total"].Value);
                    txt_total_suma.Text = totalpagar.ToString();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);

            }
        }

        private void dgDetallecompra_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            iddetallecompra = Convert.ToInt32(dgDetallecompra.SelectedCells[2].Value);
            int id_compra = Convert.ToInt32(dgDetallecompra.SelectedCells[3].Value);
            idproducto = Convert.ToInt32(dgDetallecompra.SelectedCells[4].Value);
            sevendePor = (dgDetallecompra.SelectedCells[9].Value.ToString());
            string precioCompra = (dgDetallecompra.SelectedCells[11].Value.ToString());
            string precioVenta = (dgDetallecompra.SelectedCells[12].Value.ToString());
            if (e.ColumnIndex == dgDetallecompra.Columns["EL"].Index)
            {
                eliminar_detalle_compra();
            } 
            else if(e.ColumnIndex == dgDetallecompra.Columns["editPrice"].Index)
            {
                editarPriceProduct(idproducto, precioCompra, precioVenta, id_compra);
            }

        }

        private void editarPriceProduct(int idproducto, string precioCompra , string precioVenta, int iddetallecompra) 
        {
            PowSellEver frm  = new PowSellEver(idproducto, precioCompra, precioVenta, iddetallecompra);
            frm.FormClosed += new FormClosedEventHandler(frm_FormClosed);
            frm.ShowDialog();
        }
        private void eliminar_detalle_compra()
        {
            var funcion = new Ddetallecompra();
            var parametros = new Ldetallecompra();
            parametros.IdDetallecompra = iddetallecompra;
            funcion.eliminar_detalle_compra(parametros);
            mostrarDetallecompra();

        }

        private void btn1_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "1";

        }

        private void btn2_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "2";

        }

        private void btn3_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "3";

        }

        private void btn4_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "4";

        }

        private void btn5_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "5";

        }

        private void btn6_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "6";

        }

        private void btn7_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "7";

        }

        private void btn8_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "8";

        }

        private void btn9_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "9";

        }

        private void btn0_Click(object sender, EventArgs e)
        {
            txtmonto.Text = txtmonto.Text + "0";

        }

        private void btnborrartodo_Click(object sender, EventArgs e)
        {
            txtmonto.Clear();
            SECUENCIA = true;
        }

        private void btnSeparador_Click(object sender, EventArgs e)
        {
            if (SECUENCIA == true)
            {
                txtmonto.Text = txtmonto.Text + ".";
                SECUENCIA = false;
                

            }
            else
            {
                return;
            }


        }

        private void txtmonto_KeyPress(object sender, KeyPressEventArgs e)
        {
            Bases.Separador_de_Numeros(txtmonto, e);
        }

        private void btncantidad_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtmonto.Text))
            {
                if (dgDetallecompra.RowCount > 0)
                {
                    if (sevendePor == "Unidad")
                    {
                        string cadena = txtmonto.Text;
                        if (cadena.Contains("."))
                        {
                            MessageBox.Show("Este Producto no acepta decimales ya que esta configurado para ser vendido por UNIDAD", "Formato Incorrecto", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);

                        }
                        else
                        {
                            BotonCantidad();
                        }


                    }
                    else
                    {
                        BotonCantidad();
                    }

                }
                else
                {
                    txtmonto.Clear();
                    txtmonto.Focus();
                }

            }
        }
        private void BotonCantidad()
        {
            txtpantalla = Convert.ToDouble(txtmonto.Text);
            double Cantidad;
            Cantidad = Convert.ToDouble(dgDetallecompra.SelectedCells[6].Value);
            string ControlStock;
            ControlStock = dgDetallecompra.SelectedCells[10].Value.ToString();
            if (ControlStock == "SI")
            {
                editar_detalle_compra_Cantidad();
                txtmonto.Clear();
            }

        }
        private void editar_detalle_compra_Cantidad()
        {
            var funcion = new Ddetallecompra();
            var parametros = new Ldetallecompra();
            parametros.IdCompra = idcompra;
            parametros.IdProducto = idproducto;
            parametros.Cantidad = txtpantalla;
            funcion.editar_detalle_compra_Cantidad(parametros);
            mostrarDetallecompra();

        }

        private void btnprecio_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtmonto.Text))
            {
                editar_detalle_compra_Precio();
            }
            else
            {
                txtmonto.Clear();
                txtmonto.Focus();
            }
        }


        private void editar_detalle_compra_Precio()
        {
            txtpantalla = Convert.ToDouble(txtmonto.Text);
            var funcion = new Ddetallecompra();
            var parametros = new Ldetallecompra();
            parametros.IdCompra = idcompra;
            parametros.IdProducto = idproducto;
            parametros.Costo = txtpantalla;
            funcion.editar_detalle_compra_Precio(parametros);
            mostrarDetallecompra();
            txtmonto.Clear();



        }

        private void btnagregarPro_Click(object sender, EventArgs e)
        {
            var frm = new Proveedores();
            frm.FormClosed += Frm_FormClosed;
            frm.ShowDialog();
        }

        private void Frm_FormClosed(object sender, FormClosedEventArgs e)
        {
            dibujarProveedores();
        }

        private void btnguardar_Click(object sender, EventArgs e)
        {
            if (ValidarCompraPrecios()) 
            {
                confirmarCompra();
            }
        }

        private void frm_FormClosed(Object sender, FormClosedEventArgs e)
        {
            if (ESTADO_EDICION == true)
            {
                mostrarDetallecompra();
            }
        }

        private bool ValidarCompraPrecios() 
        {
            bool suucess = true;
            foreach (DataGridViewRow fila in dgDetallecompra.Rows)
            {

                double pCompra = Convert.ToDouble(fila.Cells["Precio_de_compra"].Value);
                double pVenta = Convert.ToDouble(fila.Cells["Precio_de_venta"].Value);
                double pCosto = Convert.ToDouble(fila.Cells["Costo"].Value);
                string desc = Convert.ToString(fila.Cells["Descripcion"].Value);
                if(pCosto != pCompra) 
                {
                    MessageBox.Show("¡ El Producto " + desc + " " + "tiene un precio costo diferente a el Precio Compra ajuste El precio compra del Producto para continuar !", "Precio Invalido", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    suucess =  false;
                } else if(pCompra > pVenta)
                {
                    MessageBox.Show("¡ El Producto " + desc + " " + "tiene un precio Compra mayor a el Precio Venta ajuste El precio compra del Producto para continuar !", "Precio Invalido", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    suucess = false;
                }

            }
            return suucess;
        }

        private void confirmarCompra()
        {
            var funcion = new Dcompras();
            var parametros = new Lcompras();
            parametros.Idcompra = idcompra;
            parametros.Total = Convert.ToDouble(txt_total_suma.Text);
            parametros.IdProveedor = idproveedor;
            if(funcion.confirmarCompra(parametros)==true)
            {
                insertarStock();
                insertarKardex();
                MessageBox.Show("Compra realizada correctamente");
                Limpiar();
            }

        }
        private void Limpiar()
        {
            txtmonto.Clear();
            txtbuscar.Clear();
            idcompra = 0;
            mostrarDetallecompra();
            estadocompra = "COMPRA NUEVA";
        }
        private void insertarKardex()
        {
            LKardex parametros = new LKardex();
            Insertar_datos funcion = new Insertar_datos();
            parametros.Fecha = DateTime.Now;
            parametros.Motivo = "COMPRAS";
            foreach (DataGridViewRow rdr in dgDetallecompra.Rows)
            {
                double cantidad = Convert.ToDouble(rdr.Cells["Cantidad"].Value);
                int idproducto = Convert.ToInt32(rdr.Cells["Id_Producto1"].Value);
                parametros.Cantidad = cantidad;
                parametros.Id_producto = idproducto;
                funcion.insertar_KARDEX_Entrada(parametros);

            }

        }
        private void insertarStock()
        {
            var parametros = new Lproductos();
            var funcion = new Dproductos();
            foreach (DataGridViewRow rdr in dgDetallecompra.Rows)
            {
                double cantidad = Convert.ToDouble(rdr.Cells["Cantidad"].Value);
                int idproducto = Convert.ToInt32(rdr.Cells["Id_Producto1"].Value);
                parametros.Stock = cantidad.ToString();
                parametros.Id_Producto1 = idproducto;
                funcion.aumentarStock(parametros);

            }

        }

        private void TimerBUSCADORcodigodebarras_Tick(object sender, EventArgs e)
        {
            TimerBUSCADORcodigodebarras.Stop();
            vender_por_lectora_de_barras();
        }

        private void BTNLECTORA_Click(object sender, EventArgs e)
        {
            ModoLectora();
        }

        private void ModoLectora()
        {
            ocultar_mostrar_productos();
            lbltipodebusqueda2.Text = "Buscar con LECTORA de Codigos de Barras";
            Tipo_de_busqueda = "LECTORA";
            BTNLECTORA.BackColor = Color.LightGreen;
            btnteclado.BackColor = Color.WhiteSmoke;
            txtbuscar.Clear();
            txtbuscar.Focus();
        }

        private void ModoTeclado()
        {
            ocultar_mostrar_productos();
            lbltipodebusqueda2.Text = "Buscar con  TECLADO";
            Tipo_de_busqueda = "TECLADO";
            btnteclado.BackColor = Color.LightGreen;
            BTNLECTORA.BackColor = Color.WhiteSmoke;
            txtbuscar.Clear();
            txtbuscar.Focus();
        }

        private void btnteclado_Click(object sender, EventArgs e)
        {
            ModoTeclado();
        }

        private void dgDetallecompra_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

    
    }
}
