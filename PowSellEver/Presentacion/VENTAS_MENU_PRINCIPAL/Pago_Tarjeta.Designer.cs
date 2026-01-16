namespace PowSellEver.Presentacion.VENTAS_MENU_PRINCIPAL
{
    partial class Pago_Tarjeta
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Pago_Tarjeta));
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.lblMessage = new System.Windows.Forms.Label();
            this.pictureBox2 = new System.Windows.Forms.PictureBox();
            this.BtnCancelar = new System.Windows.Forms.Button();
            this.BtnAceptar = new System.Windows.Forms.Button();
            this.lblBody = new System.Windows.Forms.Label();
            this.lblFinish = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).BeginInit();
            this.SuspendLayout();
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = global::PowSellEver.Properties.Resources.pago__1_;
            this.pictureBox1.Location = new System.Drawing.Point(281, -5);
            this.pictureBox1.Margin = new System.Windows.Forms.Padding(5, 4, 5, 4);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(163, 111);
            this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.CenterImage;
            this.pictureBox1.TabIndex = 0;
            this.pictureBox1.TabStop = false;
            // 
            // lblMessage
            // 
            this.lblMessage.AutoSize = true;
            this.lblMessage.ForeColor = System.Drawing.SystemColors.ControlLightLight;
            this.lblMessage.Location = new System.Drawing.Point(158, 110);
            this.lblMessage.Margin = new System.Windows.Forms.Padding(5, 0, 5, 0);
            this.lblMessage.Name = "lblMessage";
            this.lblMessage.Size = new System.Drawing.Size(387, 25);
            this.lblMessage.TabIndex = 3;
            this.lblMessage.Text = "¡ Ingrese la tarjeta a la terminal y cobre";
            // 
            // pictureBox2
            // 
            this.pictureBox2.Image = global::PowSellEver.Properties.Resources.advertencia;
            this.pictureBox2.Location = new System.Drawing.Point(120, 110);
            this.pictureBox2.Name = "pictureBox2";
            this.pictureBox2.Size = new System.Drawing.Size(30, 30);
            this.pictureBox2.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pictureBox2.TabIndex = 4;
            this.pictureBox2.TabStop = false;
            // 
            // BtnCancelar
            // 
            this.BtnCancelar.BackColor = System.Drawing.Color.Transparent;
            this.BtnCancelar.BackgroundImage = global::PowSellEver.Properties.Resources.Rojo;
            this.BtnCancelar.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.BtnCancelar.FlatAppearance.BorderSize = 0;
            this.BtnCancelar.FlatAppearance.MouseDownBackColor = System.Drawing.Color.Transparent;
            this.BtnCancelar.FlatAppearance.MouseOverBackColor = System.Drawing.Color.Transparent;
            this.BtnCancelar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.BtnCancelar.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.BtnCancelar.ForeColor = System.Drawing.Color.White;
            this.BtnCancelar.Location = new System.Drawing.Point(163, 220);
            this.BtnCancelar.Margin = new System.Windows.Forms.Padding(4);
            this.BtnCancelar.Name = "BtnCancelar";
            this.BtnCancelar.Size = new System.Drawing.Size(165, 53);
            this.BtnCancelar.TabIndex = 603;
            this.BtnCancelar.Text = "Cancelar";
            this.BtnCancelar.UseVisualStyleBackColor = false;
            this.BtnCancelar.Click += new System.EventHandler(this.BtnCancelar_Click);
            // 
            // BtnAceptar
            // 
            this.BtnAceptar.BackColor = System.Drawing.Color.Transparent;
            this.BtnAceptar.BackgroundImage = global::PowSellEver.Properties.Resources.verde;
            this.BtnAceptar.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.BtnAceptar.FlatAppearance.BorderSize = 0;
            this.BtnAceptar.FlatAppearance.MouseDownBackColor = System.Drawing.Color.Transparent;
            this.BtnAceptar.FlatAppearance.MouseOverBackColor = System.Drawing.Color.Transparent;
            this.BtnAceptar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.BtnAceptar.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.BtnAceptar.ForeColor = System.Drawing.Color.White;
            this.BtnAceptar.Location = new System.Drawing.Point(349, 220);
            this.BtnAceptar.Margin = new System.Windows.Forms.Padding(4);
            this.BtnAceptar.Name = "BtnAceptar";
            this.BtnAceptar.Size = new System.Drawing.Size(165, 53);
            this.BtnAceptar.TabIndex = 604;
            this.BtnAceptar.Text = "Aceptar";
            this.BtnAceptar.UseVisualStyleBackColor = false;
            this.BtnAceptar.Click += new System.EventHandler(this.BtnAceptar_Click);
            // 
            // lblBody
            // 
            this.lblBody.AutoSize = true;
            this.lblBody.Location = new System.Drawing.Point(209, 148);
            this.lblBody.Name = "lblBody";
            this.lblBody.Size = new System.Drawing.Size(252, 25);
            this.lblBody.TabIndex = 605;
            this.lblBody.Text = "Si la tarjeta fue aceptada";
            // 
            // lblFinish
            // 
            this.lblFinish.AutoSize = true;
            this.lblFinish.Location = new System.Drawing.Point(168, 173);
            this.lblFinish.Name = "lblFinish";
            this.lblFinish.Size = new System.Drawing.Size(336, 25);
            this.lblFinish.TabIndex = 606;
            this.lblFinish.Text = "presione \'Aceptar\' para continuar.";
            // 
            // Pago_Tarjeta
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(13F, 25F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(3)))), ((int)(((byte)(36)))), ((int)(((byte)(100)))));
            this.ClientSize = new System.Drawing.Size(682, 303);
            this.Controls.Add(this.lblFinish);
            this.Controls.Add(this.lblBody);
            this.Controls.Add(this.BtnAceptar);
            this.Controls.Add(this.BtnCancelar);
            this.Controls.Add(this.pictureBox2);
            this.Controls.Add(this.lblMessage);
            this.Controls.Add(this.pictureBox1);
            this.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.ForeColor = System.Drawing.Color.White;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(5, 4, 5, 4);
            this.Name = "Pago_Tarjeta";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Pago Con Tarjeta";
            this.Load += new System.EventHandler(this.Pago_Tarjeta_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Label lblMessage;
        private System.Windows.Forms.PictureBox pictureBox2;
        internal System.Windows.Forms.Button BtnCancelar;
        internal System.Windows.Forms.Button BtnAceptar;
        private System.Windows.Forms.Label lblBody;
        private System.Windows.Forms.Label lblFinish;
    }
}