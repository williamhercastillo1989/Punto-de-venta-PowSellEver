﻿namespace Ada369Csharp.Presentacion.CopiasBd
{
    partial class CrearCopiaBd
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CrearCopiaBd));
            this.Panel12 = new System.Windows.Forms.Panel();
            this.Label1 = new System.Windows.Forms.Label();
            this.Panel1 = new System.Windows.Forms.Panel();
            this.Label6 = new System.Windows.Forms.Label();
            this.lblfrecuencia = new System.Windows.Forms.ComboBox();
            this.txtRuta = new System.Windows.Forms.TextBox();
            this.Label3 = new System.Windows.Forms.Label();
            this.Label4 = new System.Windows.Forms.Label();
            this.Label2 = new System.Windows.Forms.Label();
            this.ToolStrip1 = new System.Windows.Forms.ToolStrip();
            this.ToolStripButton22 = new System.Windows.Forms.ToolStripButton();
            this.btnGenerar = new System.Windows.Forms.Button();
            this.Panel2 = new System.Windows.Forms.Panel();
            this.Pcargando = new System.Windows.Forms.PictureBox();
            this.lbldirectorio = new System.Windows.Forms.Label();
            this.lblfecha = new System.Windows.Forms.Label();
            this.Label5 = new System.Windows.Forms.Label();
            this.Label7 = new System.Windows.Forms.Label();
            this.folderBrowserDialog1 = new System.Windows.Forms.FolderBrowserDialog();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.Panel12.SuspendLayout();
            this.Panel1.SuspendLayout();
            this.ToolStrip1.SuspendLayout();
            this.Panel2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Pcargando)).BeginInit();
            this.SuspendLayout();
            // 
            // Panel12
            // 
            this.Panel12.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(5)))), ((int)(((byte)(65)))), ((int)(((byte)(181)))));
            this.Panel12.Controls.Add(this.Label1);
            this.Panel12.Dock = System.Windows.Forms.DockStyle.Top;
            this.Panel12.Location = new System.Drawing.Point(0, 0);
            this.Panel12.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Panel12.Name = "Panel12";
            this.Panel12.Size = new System.Drawing.Size(649, 55);
            this.Panel12.TabIndex = 612;
            // 
            // Label1
            // 
            this.Label1.AutoSize = true;
            this.Label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Bold);
            this.Label1.Location = new System.Drawing.Point(4, 11);
            this.Label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label1.Name = "Label1";
            this.Label1.Size = new System.Drawing.Size(243, 29);
            this.Label1.TabIndex = 0;
            this.Label1.Text = "Copia de seguridad";
            // 
            // Panel1
            // 
            this.Panel1.Controls.Add(this.Label6);
            this.Panel1.Controls.Add(this.lblfrecuencia);
            this.Panel1.Controls.Add(this.txtRuta);
            this.Panel1.Controls.Add(this.Label3);
            this.Panel1.Controls.Add(this.Label4);
            this.Panel1.Controls.Add(this.Label2);
            this.Panel1.Controls.Add(this.ToolStrip1);
            this.Panel1.Controls.Add(this.btnGenerar);
            this.Panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.Panel1.Location = new System.Drawing.Point(0, 55);
            this.Panel1.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Panel1.Name = "Panel1";
            this.Panel1.Size = new System.Drawing.Size(649, 310);
            this.Panel1.TabIndex = 614;
            // 
            // Label6
            // 
            this.Label6.AutoSize = true;
            this.Label6.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F);
            this.Label6.Location = new System.Drawing.Point(576, 191);
            this.Label6.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label6.Name = "Label6";
            this.Label6.Size = new System.Drawing.Size(62, 25);
            this.Label6.TabIndex = 597;
            this.Label6.Text = "dia(s)";
            // 
            // lblfrecuencia
            // 
            this.lblfrecuencia.BackColor = System.Drawing.Color.White;
            this.lblfrecuencia.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F);
            this.lblfrecuencia.FormattingEnabled = true;
            this.lblfrecuencia.Items.AddRange(new object[] {
            "1",
            "7",
            "15",
            "30"});
            this.lblfrecuencia.Location = new System.Drawing.Point(505, 186);
            this.lblfrecuencia.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.lblfrecuencia.Name = "lblfrecuencia";
            this.lblfrecuencia.Size = new System.Drawing.Size(61, 33);
            this.lblfrecuencia.TabIndex = 596;
            // 
            // txtRuta
            // 
            this.txtRuta.BackColor = System.Drawing.Color.White;
            this.txtRuta.Cursor = System.Windows.Forms.Cursors.Hand;
            this.txtRuta.Enabled = false;
            this.txtRuta.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F);
            this.txtRuta.Location = new System.Drawing.Point(75, 52);
            this.txtRuta.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtRuta.Name = "txtRuta";
            this.txtRuta.Size = new System.Drawing.Size(539, 30);
            this.txtRuta.TabIndex = 1;
            // 
            // Label3
            // 
            this.Label3.AutoSize = true;
            this.Label3.BackColor = System.Drawing.Color.White;
            this.Label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.Label3.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.Label3.Location = new System.Drawing.Point(71, 101);
            this.Label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label3.Name = "Label3";
            this.Label3.Size = new System.Drawing.Size(499, 60);
            this.Label3.TabIndex = 0;
            this.Label3.Text = "Guarda copias de Seguridad de la base de datos para no perder \r\nningun Dato de tu" +
    " Empresa. Podras recuperar toda la Informacion\r\nen caso Tu PC tenga algun proble" +
    "ma";
            // 
            // Label4
            // 
            this.Label4.AutoSize = true;
            this.Label4.BackColor = System.Drawing.Color.White;
            this.Label4.Cursor = System.Windows.Forms.Cursors.Hand;
            this.Label4.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Bold);
            this.Label4.Location = new System.Drawing.Point(69, 186);
            this.Label4.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label4.Name = "Label4";
            this.Label4.Size = new System.Drawing.Size(410, 29);
            this.Label4.TabIndex = 0;
            this.Label4.Text = "Generar copias Automaticas cada:";
            // 
            // Label2
            // 
            this.Label2.AutoSize = true;
            this.Label2.BackColor = System.Drawing.Color.White;
            this.Label2.Cursor = System.Windows.Forms.Cursors.Hand;
            this.Label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Bold);
            this.Label2.Location = new System.Drawing.Point(69, 18);
            this.Label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label2.Name = "Label2";
            this.Label2.Size = new System.Drawing.Size(357, 29);
            this.Label2.TabIndex = 0;
            this.Label2.Text = "Ruta de Copias de Seguridad";
            this.Label2.Click += new System.EventHandler(this.Label2_Click);
            // 
            // ToolStrip1
            // 
            this.ToolStrip1.AutoSize = false;
            this.ToolStrip1.BackColor = System.Drawing.Color.White;
            this.ToolStrip1.Dock = System.Windows.Forms.DockStyle.None;
            this.ToolStrip1.GripStyle = System.Windows.Forms.ToolStripGripStyle.Hidden;
            this.ToolStrip1.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.ToolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.ToolStripButton22});
            this.ToolStrip1.LayoutStyle = System.Windows.Forms.ToolStripLayoutStyle.HorizontalStackWithOverflow;
            this.ToolStrip1.Location = new System.Drawing.Point(12, 2);
            this.ToolStrip1.Name = "ToolStrip1";
            this.ToolStrip1.RenderMode = System.Windows.Forms.ToolStripRenderMode.System;
            this.ToolStrip1.Size = new System.Drawing.Size(96, 60);
            this.ToolStrip1.TabIndex = 595;
            this.ToolStrip1.Text = "ToolStrip1";
            // 
            // ToolStripButton22
            // 
            this.ToolStripButton22.BackColor = System.Drawing.Color.White;
            this.ToolStripButton22.Font = new System.Drawing.Font("Microsoft Sans Serif", 11F);
            this.ToolStripButton22.ForeColor = System.Drawing.Color.Black;
            this.ToolStripButton22.Image = ((System.Drawing.Image)(resources.GetObject("ToolStripButton22.Image")));
            this.ToolStripButton22.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.ToolStripButton22.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.ToolStripButton22.Name = "ToolStripButton22";
            this.ToolStripButton22.Size = new System.Drawing.Size(45, 57);
            this.ToolStripButton22.Text = "+";
            this.ToolStripButton22.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.ToolStripButton22.ToolTipText = "Buscar Ruta";
            this.ToolStripButton22.Click += new System.EventHandler(this.ToolStripButton22_Click);
            // 
            // btnGenerar
            // 
            this.btnGenerar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(5)))), ((int)(((byte)(65)))), ((int)(((byte)(181)))));
            this.btnGenerar.FlatAppearance.BorderSize = 0;
            this.btnGenerar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnGenerar.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold);
            this.btnGenerar.Location = new System.Drawing.Point(75, 228);
            this.btnGenerar.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.btnGenerar.Name = "btnGenerar";
            this.btnGenerar.Size = new System.Drawing.Size(540, 53);
            this.btnGenerar.TabIndex = 2;
            this.btnGenerar.Text = "Generar Copia ahora mismo";
            this.btnGenerar.UseVisualStyleBackColor = false;
            this.btnGenerar.Click += new System.EventHandler(this.btnGenerar_Click);
            // 
            // Panel2
            // 
            this.Panel2.Controls.Add(this.Pcargando);
            this.Panel2.Controls.Add(this.lbldirectorio);
            this.Panel2.Controls.Add(this.lblfecha);
            this.Panel2.Controls.Add(this.Label5);
            this.Panel2.Controls.Add(this.Label7);
            this.Panel2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Panel2.Location = new System.Drawing.Point(0, 365);
            this.Panel2.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Panel2.Name = "Panel2";
            this.Panel2.Size = new System.Drawing.Size(649, 188);
            this.Panel2.TabIndex = 615;
            // 
            // Pcargando
            // 
            this.Pcargando.Image = ((System.Drawing.Image)(resources.GetObject("Pcargando.Image")));
            this.Pcargando.Location = new System.Drawing.Point(0, 0);
            this.Pcargando.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Pcargando.Name = "Pcargando";
            this.Pcargando.Size = new System.Drawing.Size(649, 183);
            this.Pcargando.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.Pcargando.TabIndex = 613;
            this.Pcargando.TabStop = false;
            this.Pcargando.Visible = false;
            // 
            // lbldirectorio
            // 
            this.lbldirectorio.BackColor = System.Drawing.Color.White;
            this.lbldirectorio.Cursor = System.Windows.Forms.Cursors.Hand;
            this.lbldirectorio.Font = new System.Drawing.Font("Microsoft Sans Serif", 8F);
            this.lbldirectorio.ForeColor = System.Drawing.Color.DimGray;
            this.lbldirectorio.Location = new System.Drawing.Point(19, 4);
            this.lbldirectorio.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lbldirectorio.Name = "lbldirectorio";
            this.lbldirectorio.Size = new System.Drawing.Size(567, 73);
            this.lbldirectorio.TabIndex = 1;
            this.lbldirectorio.Text = "-";
            // 
            // lblfecha
            // 
            this.lblfecha.AutoSize = true;
            this.lblfecha.BackColor = System.Drawing.Color.White;
            this.lblfecha.Cursor = System.Windows.Forms.Cursors.Hand;
            this.lblfecha.Font = new System.Drawing.Font("Microsoft Sans Serif", 8F);
            this.lblfecha.ForeColor = System.Drawing.Color.DimGray;
            this.lblfecha.Location = new System.Drawing.Point(19, 135);
            this.lblfecha.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblfecha.Name = "lblfecha";
            this.lblfecha.Size = new System.Drawing.Size(61, 17);
            this.lblfecha.TabIndex = 0;
            this.lblfecha.Text = "Ninguna";
            // 
            // Label5
            // 
            this.Label5.AutoSize = true;
            this.Label5.BackColor = System.Drawing.Color.White;
            this.Label5.Cursor = System.Windows.Forms.Cursors.Hand;
            this.Label5.Font = new System.Drawing.Font("Microsoft Sans Serif", 8F);
            this.Label5.ForeColor = System.Drawing.Color.DimGray;
            this.Label5.Location = new System.Drawing.Point(19, 106);
            this.Label5.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label5.Name = "Label5";
            this.Label5.Size = new System.Drawing.Size(42, 17);
            this.Label5.TabIndex = 0;
            this.Label5.Text = "Local";
            // 
            // Label7
            // 
            this.Label7.AutoSize = true;
            this.Label7.BackColor = System.Drawing.Color.White;
            this.Label7.Cursor = System.Windows.Forms.Cursors.Hand;
            this.Label7.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Bold);
            this.Label7.Location = new System.Drawing.Point(16, 76);
            this.Label7.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label7.Name = "Label7";
            this.Label7.Size = new System.Drawing.Size(163, 29);
            this.Label7.TabIndex = 0;
            this.Label7.Text = "Ultima Copia";
            // 
            // timer1
            // 
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // CrearCopiaBd
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(649, 553);
            this.Controls.Add(this.Panel2);
            this.Controls.Add(this.Panel1);
            this.Controls.Add(this.Panel12);
            this.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.MaximizeBox = false;
            this.Name = "CrearCopiaBd";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Load += new System.EventHandler(this.CrearCopiaBd_Load);
            this.Panel12.ResumeLayout(false);
            this.Panel12.PerformLayout();
            this.Panel1.ResumeLayout(false);
            this.Panel1.PerformLayout();
            this.ToolStrip1.ResumeLayout(false);
            this.ToolStrip1.PerformLayout();
            this.Panel2.ResumeLayout(false);
            this.Panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Pcargando)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        internal System.Windows.Forms.Panel Panel12;
        internal System.Windows.Forms.Label Label1;
        internal System.Windows.Forms.Panel Panel1;
        internal System.Windows.Forms.Label Label6;
        internal System.Windows.Forms.ComboBox lblfrecuencia;
        internal System.Windows.Forms.TextBox txtRuta;
        internal System.Windows.Forms.Label Label3;
        internal System.Windows.Forms.Label Label4;
        internal System.Windows.Forms.Label Label2;
        internal System.Windows.Forms.ToolStrip ToolStrip1;
        internal System.Windows.Forms.ToolStripButton ToolStripButton22;
        internal System.Windows.Forms.Button btnGenerar;
        internal System.Windows.Forms.Panel Panel2;
        internal System.Windows.Forms.Label lblfecha;
        internal System.Windows.Forms.Label Label5;
        internal System.Windows.Forms.Label Label7;
        internal System.Windows.Forms.Label lbldirectorio;
        private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
        internal System.Windows.Forms.PictureBox Pcargando;
        private System.Windows.Forms.Timer timer1;
    }
}