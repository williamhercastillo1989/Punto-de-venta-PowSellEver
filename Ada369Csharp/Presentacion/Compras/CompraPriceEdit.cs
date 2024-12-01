using Ada369Csharp.Datos;
using Ada369Csharp.Logica;
using Ada369Csharp.Presentacion.VENTAS_MENU_PRINCIPAL;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Ada369Csharp.Presentacion.Compras
{
    public partial class PowSellEver : Form
    {
        private int id_producto;
        private string precio_compra;
        private string precio_venta;
        private int id_detallecompra;
        public PowSellEver()
        {
            InitializeComponent();
        }

        public PowSellEver(int Idproducto, string precioCompra, string precioVenta, int id_detallecompra)
        {
            this.id_producto = Idproducto;
            this.precio_compra = precioCompra;
            this.precio_venta = precioVenta;
            this.id_detallecompra = id_detallecompra;
            InitializeComponent();
            
        }

        private void BtnGuardarDatos_Click(object sender, EventArgs e)
        {
            if(txtcompra.Text != "" && txtVenta.Text != "") 
            {
                if (Convert.ToDouble(txtcompra.Text) > Convert.ToDouble(txtVenta.Text))
                {
                    MessageBox.Show("El precio compra del producto no puede se mayor al Precio Venta", "Validar datos", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    return;
                }
                else
                {
                    RealizarCompra.idcompra = id_detallecompra;

                    editarPreciosCompraVenta();
                    RealizarCompra.ESTADO_EDICION = true;

                    Dispose();
                }
            }
            else 
            {
                MessageBox.Show("Ingrese las contidades del precio del producto", "No pueden ir vacios", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                return;
            }
        }

    

        private void editarPreciosCompraVenta()
        {
            Lproductos parametros = new Lproductos();
            Editar_datos funcion = new Editar_datos();
            parametros.Id_Producto1 = id_producto;
            parametros.Precio_de_venta = Convert.ToDouble(txtVenta.Text);
            parametros.Precio_de_compra = Convert.ToDouble(txtcompra.Text);
            funcion.EditarPreciosProductosCompras(parametros);
        }

        private void PowSellEver_Load(object sender, EventArgs e)
        {
            txtcompra.Text = precio_compra;
            txtVenta.Text = precio_venta;
        }
    }
}
