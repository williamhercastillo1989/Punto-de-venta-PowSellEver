using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PowSellEver.Presentacion.VENTAS_MENU_PRINCIPAL
{
    public partial class Pago_Tarjeta : Form
    {

        public String  total;
        public Pago_Tarjeta()
        {
            InitializeComponent();
        }

     

        private void BtnCancelar_Click(object sender, EventArgs e)
        {
            MEDIOS_DE_PAGO.cardPayments = false;
            Dispose();
        }

        private void BtnAceptar_Click(object sender, EventArgs e)
        {
            MEDIOS_DE_PAGO.cardPayments = true;
            Dispose();
        }



        private void Pago_Tarjeta_Load(object sender, EventArgs e)
        {
            lblMessage.Text = $"Ingrese la tarjeta a la terminal y cobre ${total}";
        }

    }
}
