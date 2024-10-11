namespace Ada369Csharp.Presentacion.Compras
{
    partial class PowSellEver
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(PowSellEver));
            this.lblPriceCompra = new System.Windows.Forms.Label();
            this.txtcompra = new System.Windows.Forms.TextBox();
            this.BtnGuardarDatos = new System.Windows.Forms.Button();
            this.lblPriceVenta = new System.Windows.Forms.Label();
            this.txtVenta = new System.Windows.Forms.TextBox();
            this.LblcantidadAumentar = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // lblPriceCompra
            // 
            this.lblPriceCompra.AutoSize = true;
            this.lblPriceCompra.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.lblPriceCompra.ForeColor = System.Drawing.Color.White;
            this.lblPriceCompra.Location = new System.Drawing.Point(50, 124);
            this.lblPriceCompra.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblPriceCompra.Name = "lblPriceCompra";
            this.lblPriceCompra.Size = new System.Drawing.Size(189, 29);
            this.lblPriceCompra.TabIndex = 546;
            this.lblPriceCompra.Text = "Precio Compra:";
            // 
            // txtcompra
            // 
            this.txtcompra.Font = new System.Drawing.Font("Microsoft Sans Serif", 25F, System.Drawing.FontStyle.Bold);
            this.txtcompra.Location = new System.Drawing.Point(55, 168);
            this.txtcompra.Margin = new System.Windows.Forms.Padding(4);
            this.txtcompra.Name = "txtcompra";
            this.txtcompra.Size = new System.Drawing.Size(216, 55);
            this.txtcompra.TabIndex = 548;
            // 
            // BtnGuardarDatos
            // 
            this.BtnGuardarDatos.BackColor = System.Drawing.Color.Transparent;
            this.BtnGuardarDatos.BackgroundImage = global::Ada369Csharp.Properties.Resources.verde;
            this.BtnGuardarDatos.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.BtnGuardarDatos.FlatAppearance.BorderSize = 0;
            this.BtnGuardarDatos.FlatAppearance.MouseDownBackColor = System.Drawing.Color.Transparent;
            this.BtnGuardarDatos.FlatAppearance.MouseOverBackColor = System.Drawing.Color.Transparent;
            this.BtnGuardarDatos.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.BtnGuardarDatos.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.BtnGuardarDatos.ForeColor = System.Drawing.Color.White;
            this.BtnGuardarDatos.Location = new System.Drawing.Point(607, 168);
            this.BtnGuardarDatos.Margin = new System.Windows.Forms.Padding(4);
            this.BtnGuardarDatos.Name = "BtnGuardarDatos";
            this.BtnGuardarDatos.Size = new System.Drawing.Size(165, 53);
            this.BtnGuardarDatos.TabIndex = 602;
            this.BtnGuardarDatos.Text = "Guardar";
            this.BtnGuardarDatos.UseVisualStyleBackColor = false;
            this.BtnGuardarDatos.Click += new System.EventHandler(this.BtnGuardarDatos_Click);
            // 
            // lblPriceVenta
            // 
            this.lblPriceVenta.AutoSize = true;
            this.lblPriceVenta.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.lblPriceVenta.ForeColor = System.Drawing.Color.White;
            this.lblPriceVenta.Location = new System.Drawing.Point(344, 124);
            this.lblPriceVenta.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblPriceVenta.Name = "lblPriceVenta";
            this.lblPriceVenta.Size = new System.Drawing.Size(165, 29);
            this.lblPriceVenta.TabIndex = 603;
            this.lblPriceVenta.Text = "Precio Venta:";
            // 
            // txtVenta
            // 
            this.txtVenta.Font = new System.Drawing.Font("Microsoft Sans Serif", 25F, System.Drawing.FontStyle.Bold);
            this.txtVenta.Location = new System.Drawing.Point(339, 168);
            this.txtVenta.Margin = new System.Windows.Forms.Padding(4);
            this.txtVenta.Name = "txtVenta";
            this.txtVenta.Size = new System.Drawing.Size(216, 55);
            this.txtVenta.TabIndex = 604;
            // 
            // LblcantidadAumentar
            // 
            this.LblcantidadAumentar.AutoSize = true;
            this.LblcantidadAumentar.Font = new System.Drawing.Font("Microsoft YaHei UI", 19.8F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.LblcantidadAumentar.ForeColor = System.Drawing.Color.White;
            this.LblcantidadAumentar.Location = new System.Drawing.Point(50, 44);
            this.LblcantidadAumentar.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.LblcantidadAumentar.Name = "LblcantidadAumentar";
            this.LblcantidadAumentar.Size = new System.Drawing.Size(546, 44);
            this.LblcantidadAumentar.TabIndex = 605;
            this.LblcantidadAumentar.Text = "Edición de Precios del Producto";
            // 
            // PowSellEver
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(3)))), ((int)(((byte)(36)))), ((int)(((byte)(100)))));
            this.ClientSize = new System.Drawing.Size(837, 282);
            this.Controls.Add(this.LblcantidadAumentar);
            this.Controls.Add(this.txtVenta);
            this.Controls.Add(this.lblPriceVenta);
            this.Controls.Add(this.BtnGuardarDatos);
            this.Controls.Add(this.txtcompra);
            this.Controls.Add(this.lblPriceCompra);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "PowSellEver";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Edicion de Precios";
            this.Load += new System.EventHandler(this.PowSellEver_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        internal System.Windows.Forms.Label lblPriceCompra;
        internal System.Windows.Forms.TextBox txtcompra;
        internal System.Windows.Forms.Button BtnGuardarDatos;
        internal System.Windows.Forms.Label lblPriceVenta;
        internal System.Windows.Forms.TextBox txtVenta;
        internal System.Windows.Forms.Label LblcantidadAumentar;
    }
}