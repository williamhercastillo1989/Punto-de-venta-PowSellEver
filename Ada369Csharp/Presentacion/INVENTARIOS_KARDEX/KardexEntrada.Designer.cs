﻿namespace Ada369Csharp.Presentacion.INVENTARIOS_KARDEX
{
    partial class KardexEntrada
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(KardexEntrada));
            this.Panel5 = new System.Windows.Forms.Panel();
            this.DatalistadoProductos = new System.Windows.Forms.DataGridView();
            this.DataGridViewCheckBoxColumn1 = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.PanelAnuncioPrecios = new System.Windows.Forms.Panel();
            this.PictureBox2 = new System.Windows.Forms.PictureBox();
            this.lblAnunciodeNuevosPrecios = new System.Windows.Forms.Label();
            this.Label24 = new System.Windows.Forms.Label();
            this.ComboBox3 = new System.Windows.Forms.ComboBox();
            this.txtpreciomayoreo = new System.Windows.Forms.TextBox();
            this.txtprecio_venta = new System.Windows.Forms.TextBox();
            this.txtcosto = new System.Windows.Forms.TextBox();
            this.txtcmotivo = new System.Windows.Forms.TextBox();
            this.lblcantidadactual = new System.Windows.Forms.Label();
            this.Label21 = new System.Windows.Forms.Label();
            this.Label7 = new System.Windows.Forms.Label();
            this.btn_insertar = new System.Windows.Forms.Button();
            this.txtfecha = new System.Windows.Forms.DateTimePicker();
            this.txtagregar = new System.Windows.Forms.TextBox();
            this.Label5 = new System.Windows.Forms.Label();
            this.Label43 = new System.Windows.Forms.Label();
            this.TXTBUSCARProducto = new System.Windows.Forms.TextBox();
            this.Label42 = new System.Windows.Forms.Label();
            this.Label44 = new System.Windows.Forms.Label();
            this.Label32 = new System.Windows.Forms.Label();
            this.ComboBox1 = new System.Windows.Forms.ComboBox();
            this.Label41 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.Panel5.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.DatalistadoProductos)).BeginInit();
            this.PanelAnuncioPrecios.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.PictureBox2)).BeginInit();
            this.SuspendLayout();
            // 
            // Panel5
            // 
            this.Panel5.BackColor = System.Drawing.SystemColors.ButtonHighlight;
            this.Panel5.Controls.Add(this.DatalistadoProductos);
            this.Panel5.Controls.Add(this.PanelAnuncioPrecios);
            this.Panel5.Controls.Add(this.Label24);
            this.Panel5.Controls.Add(this.ComboBox3);
            this.Panel5.Controls.Add(this.txtpreciomayoreo);
            this.Panel5.Controls.Add(this.txtprecio_venta);
            this.Panel5.Controls.Add(this.txtcosto);
            this.Panel5.Controls.Add(this.txtcmotivo);
            this.Panel5.Controls.Add(this.lblcantidadactual);
            this.Panel5.Controls.Add(this.Label21);
            this.Panel5.Controls.Add(this.Label7);
            this.Panel5.Controls.Add(this.btn_insertar);
            this.Panel5.Controls.Add(this.txtfecha);
            this.Panel5.Controls.Add(this.txtagregar);
            this.Panel5.Controls.Add(this.Label5);
            this.Panel5.Controls.Add(this.Label43);
            this.Panel5.Controls.Add(this.TXTBUSCARProducto);
            this.Panel5.Controls.Add(this.Label42);
            this.Panel5.Controls.Add(this.Label44);
            this.Panel5.Controls.Add(this.Label32);
            this.Panel5.Controls.Add(this.ComboBox1);
            this.Panel5.Controls.Add(this.Label41);
            this.Panel5.Location = new System.Drawing.Point(80, 103);
            this.Panel5.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Panel5.Name = "Panel5";
            this.Panel5.Size = new System.Drawing.Size(779, 716);
            this.Panel5.TabIndex = 546;
            this.Panel5.Paint += new System.Windows.Forms.PaintEventHandler(this.Panel5_Paint);
            // 
            // DatalistadoProductos
            // 
            this.DatalistadoProductos.AllowUserToAddRows = false;
            this.DatalistadoProductos.AllowUserToDeleteRows = false;
            this.DatalistadoProductos.AllowUserToResizeRows = false;
            this.DatalistadoProductos.BackgroundColor = System.Drawing.Color.White;
            this.DatalistadoProductos.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.DatalistadoProductos.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.None;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.DatalistadoProductos.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.DatalistadoProductos.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.DatalistadoProductos.ColumnHeadersVisible = false;
            this.DatalistadoProductos.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.DataGridViewCheckBoxColumn1});
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = System.Drawing.SystemColors.Window;
            dataGridViewCellStyle2.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle2.ForeColor = System.Drawing.SystemColors.ControlText;
            dataGridViewCellStyle2.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle2.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.DatalistadoProductos.DefaultCellStyle = dataGridViewCellStyle2;
            this.DatalistadoProductos.EnableHeadersVisualStyles = false;
            this.DatalistadoProductos.Location = new System.Drawing.Point(15, 128);
            this.DatalistadoProductos.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.DatalistadoProductos.Name = "DatalistadoProductos";
            this.DatalistadoProductos.ReadOnly = true;
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle3.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle3.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle3.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle3.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle3.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.DatalistadoProductos.RowHeadersDefaultCellStyle = dataGridViewCellStyle3;
            this.DatalistadoProductos.RowHeadersVisible = false;
            this.DatalistadoProductos.RowHeadersWidth = 5;
            this.DatalistadoProductos.RowTemplate.DefaultCellStyle.SelectionBackColor = System.Drawing.SystemColors.HotTrack;
            this.DatalistadoProductos.RowTemplate.Height = 33;
            this.DatalistadoProductos.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.DatalistadoProductos.Size = new System.Drawing.Size(749, 572);
            this.DatalistadoProductos.TabIndex = 488;
            this.DatalistadoProductos.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.DatalistadoProductos_CellClick);
            // 
            // DataGridViewCheckBoxColumn1
            // 
            this.DataGridViewCheckBoxColumn1.DataPropertyName = "Marcar";
            this.DataGridViewCheckBoxColumn1.HeaderText = "Marcar";
            this.DataGridViewCheckBoxColumn1.MinimumWidth = 6;
            this.DataGridViewCheckBoxColumn1.Name = "DataGridViewCheckBoxColumn1";
            this.DataGridViewCheckBoxColumn1.ReadOnly = true;
            this.DataGridViewCheckBoxColumn1.Visible = false;
            this.DataGridViewCheckBoxColumn1.Width = 125;
            // 
            // PanelAnuncioPrecios
            // 
            this.PanelAnuncioPrecios.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.PanelAnuncioPrecios.Controls.Add(this.PictureBox2);
            this.PanelAnuncioPrecios.Controls.Add(this.lblAnunciodeNuevosPrecios);
            this.PanelAnuncioPrecios.Location = new System.Drawing.Point(224, 594);
            this.PanelAnuncioPrecios.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.PanelAnuncioPrecios.Name = "PanelAnuncioPrecios";
            this.PanelAnuncioPrecios.Size = new System.Drawing.Size(540, 94);
            this.PanelAnuncioPrecios.TabIndex = 529;
            // 
            // PictureBox2
            // 
            this.PictureBox2.Image = ((System.Drawing.Image)(resources.GetObject("PictureBox2.Image")));
            this.PictureBox2.Location = new System.Drawing.Point(8, 0);
            this.PictureBox2.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.PictureBox2.Name = "PictureBox2";
            this.PictureBox2.Size = new System.Drawing.Size(48, 58);
            this.PictureBox2.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.PictureBox2.TabIndex = 530;
            this.PictureBox2.TabStop = false;
            // 
            // lblAnunciodeNuevosPrecios
            // 
            this.lblAnunciodeNuevosPrecios.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.lblAnunciodeNuevosPrecios.Location = new System.Drawing.Point(64, 11);
            this.lblAnunciodeNuevosPrecios.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblAnunciodeNuevosPrecios.Name = "lblAnunciodeNuevosPrecios";
            this.lblAnunciodeNuevosPrecios.Size = new System.Drawing.Size(464, 70);
            this.lblAnunciodeNuevosPrecios.TabIndex = 0;
            this.lblAnunciodeNuevosPrecios.Text = "Label28";
            // 
            // Label24
            // 
            this.Label24.AutoSize = true;
            this.Label24.Location = new System.Drawing.Point(793, 370);
            this.Label24.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label24.Name = "Label24";
            this.Label24.Size = new System.Drawing.Size(48, 16);
            this.Label24.TabIndex = 508;
            this.Label24.Text = "Label1";
            // 
            // ComboBox3
            // 
            this.ComboBox3.FormattingEnabled = true;
            this.ComboBox3.Location = new System.Drawing.Point(783, 329);
            this.ComboBox3.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.ComboBox3.Name = "ComboBox3";
            this.ComboBox3.Size = new System.Drawing.Size(209, 24);
            this.ComboBox3.TabIndex = 509;
            // 
            // txtpreciomayoreo
            // 
            this.txtpreciomayoreo.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.txtpreciomayoreo.Location = new System.Drawing.Point(224, 345);
            this.txtpreciomayoreo.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtpreciomayoreo.Name = "txtpreciomayoreo";
            this.txtpreciomayoreo.Size = new System.Drawing.Size(201, 36);
            this.txtpreciomayoreo.TabIndex = 505;
            this.txtpreciomayoreo.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.txtpreciomayoreo_KeyPress);
            // 
            // txtprecio_venta
            // 
            this.txtprecio_venta.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.txtprecio_venta.Location = new System.Drawing.Point(224, 300);
            this.txtprecio_venta.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtprecio_venta.Name = "txtprecio_venta";
            this.txtprecio_venta.Size = new System.Drawing.Size(201, 36);
            this.txtprecio_venta.TabIndex = 505;
            this.txtprecio_venta.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.txtprecio_venta_KeyPress);
            // 
            // txtcosto
            // 
            this.txtcosto.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.txtcosto.Location = new System.Drawing.Point(224, 252);
            this.txtcosto.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtcosto.Name = "txtcosto";
            this.txtcosto.Size = new System.Drawing.Size(201, 36);
            this.txtcosto.TabIndex = 505;
            this.txtcosto.TextChanged += new System.EventHandler(this.txtcosto_TextChanged);
            this.txtcosto.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.txtcosto_KeyPress);
            // 
            // txtcmotivo
            // 
            this.txtcmotivo.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.txtcmotivo.Location = new System.Drawing.Point(224, 439);
            this.txtcmotivo.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtcmotivo.Multiline = true;
            this.txtcmotivo.Name = "txtcmotivo";
            this.txtcmotivo.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtcmotivo.Size = new System.Drawing.Size(479, 63);
            this.txtcmotivo.TabIndex = 505;
            // 
            // lblcantidadactual
            // 
            this.lblcantidadactual.AutoSize = true;
            this.lblcantidadactual.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F, System.Drawing.FontStyle.Bold);
            this.lblcantidadactual.ForeColor = System.Drawing.Color.MidnightBlue;
            this.lblcantidadactual.Location = new System.Drawing.Point(225, 129);
            this.lblcantidadactual.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblcantidadactual.Name = "lblcantidadactual";
            this.lblcantidadactual.Size = new System.Drawing.Size(28, 29);
            this.lblcantidadactual.TabIndex = 0;
            this.lblcantidadactual.Text = "0";
            // 
            // Label21
            // 
            this.Label21.AutoSize = true;
            this.Label21.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.Label21.ForeColor = System.Drawing.Color.MidnightBlue;
            this.Label21.Location = new System.Drawing.Point(8, 129);
            this.Label21.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label21.Name = "Label21";
            this.Label21.Size = new System.Drawing.Size(199, 29);
            this.Label21.TabIndex = 0;
            this.Label21.Text = "Cantidad Actual:";
            // 
            // Label7
            // 
            this.Label7.AutoSize = true;
            this.Label7.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.Label7.ForeColor = System.Drawing.Color.Black;
            this.Label7.Location = new System.Drawing.Point(80, 393);
            this.Label7.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label7.Name = "Label7";
            this.Label7.Size = new System.Drawing.Size(130, 29);
            this.Label7.TabIndex = 0;
            this.Label7.Text = "F. de Reg:";
            // 
            // btn_insertar
            // 
            this.btn_insertar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(204)))), ((int)(((byte)(1)))));
            this.btn_insertar.FlatAppearance.BorderSize = 0;
            this.btn_insertar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btn_insertar.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold);
            this.btn_insertar.ForeColor = System.Drawing.Color.Black;
            this.btn_insertar.Location = new System.Drawing.Point(224, 530);
            this.btn_insertar.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.btn_insertar.Name = "btn_insertar";
            this.btn_insertar.Size = new System.Drawing.Size(483, 54);
            this.btn_insertar.TabIndex = 527;
            this.btn_insertar.Text = "+ GUARDAR ";
            this.btn_insertar.UseVisualStyleBackColor = false;
            this.btn_insertar.Click += new System.EventHandler(this.btn_insertar_Click);
            // 
            // txtfecha
            // 
            this.txtfecha.Checked = false;
            this.txtfecha.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.txtfecha.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.txtfecha.Location = new System.Drawing.Point(224, 393);
            this.txtfecha.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtfecha.Name = "txtfecha";
            this.txtfecha.Size = new System.Drawing.Size(201, 36);
            this.txtfecha.TabIndex = 447;
            // 
            // txtagregar
            // 
            this.txtagregar.Font = new System.Drawing.Font("Microsoft Sans Serif", 20F);
            this.txtagregar.Location = new System.Drawing.Point(224, 185);
            this.txtagregar.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtagregar.Name = "txtagregar";
            this.txtagregar.Size = new System.Drawing.Size(241, 45);
            this.txtagregar.TabIndex = 492;
            this.txtagregar.TextChanged += new System.EventHandler(this.txtagregar_TextChanged);
            this.txtagregar.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.txtagregar_KeyPress);
            // 
            // Label5
            // 
            this.Label5.AutoSize = true;
            this.Label5.Font = new System.Drawing.Font("Microsoft Sans Serif", 25F);
            this.Label5.ForeColor = System.Drawing.Color.Black;
            this.Label5.Location = new System.Drawing.Point(20, 180);
            this.Label5.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label5.Name = "Label5";
            this.Label5.Size = new System.Drawing.Size(180, 48);
            this.Label5.TabIndex = 491;
            this.Label5.Text = "Agregar:";
            // 
            // Label43
            // 
            this.Label43.AutoSize = true;
            this.Label43.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.Label43.ForeColor = System.Drawing.Color.Black;
            this.Label43.Location = new System.Drawing.Point(11, 345);
            this.Label43.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label43.Name = "Label43";
            this.Label43.Size = new System.Drawing.Size(198, 29);
            this.Label43.TabIndex = 0;
            this.Label43.Text = "Precio mayoreo:";
            // 
            // TXTBUSCARProducto
            // 
            this.TXTBUSCARProducto.Font = new System.Drawing.Font("Microsoft Sans Serif", 18F);
            this.TXTBUSCARProducto.Location = new System.Drawing.Point(17, 81);
            this.TXTBUSCARProducto.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.TXTBUSCARProducto.Name = "TXTBUSCARProducto";
            this.TXTBUSCARProducto.Size = new System.Drawing.Size(733, 41);
            this.TXTBUSCARProducto.TabIndex = 490;
            this.TXTBUSCARProducto.TextChanged += new System.EventHandler(this.TXTBUSCARProducto_TextChanged);
            // 
            // Label42
            // 
            this.Label42.AutoSize = true;
            this.Label42.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.Label42.ForeColor = System.Drawing.Color.Black;
            this.Label42.Location = new System.Drawing.Point(48, 304);
            this.Label42.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label42.Name = "Label42";
            this.Label42.Size = new System.Drawing.Size(161, 29);
            this.Label42.TabIndex = 0;
            this.Label42.Text = "Precio venta:";
            // 
            // Label44
            // 
            this.Label44.AutoSize = true;
            this.Label44.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F);
            this.Label44.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(64)))), ((int)(((byte)(64)))), ((int)(((byte)(64)))));
            this.Label44.Location = new System.Drawing.Point(13, 50);
            this.Label44.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label44.Name = "Label44";
            this.Label44.Size = new System.Drawing.Size(194, 29);
            this.Label44.TabIndex = 489;
            this.Label44.Text = "Buscar producto:";
            // 
            // Label32
            // 
            this.Label32.AutoSize = true;
            this.Label32.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.Label32.ForeColor = System.Drawing.Color.Black;
            this.Label32.Location = new System.Drawing.Point(123, 252);
            this.Label32.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label32.Name = "Label32";
            this.Label32.Size = new System.Drawing.Size(86, 29);
            this.Label32.TabIndex = 0;
            this.Label32.Text = "Costo:";
            // 
            // ComboBox1
            // 
            this.ComboBox1.FormattingEnabled = true;
            this.ComboBox1.Location = new System.Drawing.Point(224, 87);
            this.ComboBox1.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.ComboBox1.Name = "ComboBox1";
            this.ComboBox1.Size = new System.Drawing.Size(155, 24);
            this.ComboBox1.TabIndex = 497;
            // 
            // Label41
            // 
            this.Label41.AutoSize = true;
            this.Label41.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F);
            this.Label41.ForeColor = System.Drawing.Color.Black;
            this.Label41.Location = new System.Drawing.Point(112, 439);
            this.Label41.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label41.Name = "Label41";
            this.Label41.Size = new System.Drawing.Size(95, 29);
            this.Label41.TabIndex = 0;
            this.Label41.Text = "Motivo:";
            // 
            // label1
            // 
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 25F, System.Drawing.FontStyle.Bold);
            this.label1.ForeColor = System.Drawing.Color.Black;
            this.label1.Location = new System.Drawing.Point(80, 33);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(779, 66);
            this.label1.TabIndex = 547;
            this.label1.Text = "INGRESO DE PRODUCTO";
            this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // KardexEntrada
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(912, 834);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.Panel5);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "KardexEntrada";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Load += new System.EventHandler(this.KardexEntrada_Load);
            this.Panel5.ResumeLayout(false);
            this.Panel5.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.DatalistadoProductos)).EndInit();
            this.PanelAnuncioPrecios.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.PictureBox2)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        internal System.Windows.Forms.Panel Panel5;
        internal System.Windows.Forms.DataGridView DatalistadoProductos;
        internal System.Windows.Forms.Panel PanelAnuncioPrecios;
        internal System.Windows.Forms.PictureBox PictureBox2;
        internal System.Windows.Forms.Label lblAnunciodeNuevosPrecios;
        internal System.Windows.Forms.Label Label24;
        internal System.Windows.Forms.ComboBox ComboBox3;
        internal System.Windows.Forms.TextBox txtpreciomayoreo;
        internal System.Windows.Forms.TextBox txtprecio_venta;
        internal System.Windows.Forms.TextBox txtcosto;
        internal System.Windows.Forms.TextBox txtcmotivo;
        internal System.Windows.Forms.Label lblcantidadactual;
        internal System.Windows.Forms.Label Label21;
        internal System.Windows.Forms.Label Label7;
        internal System.Windows.Forms.Button btn_insertar;
        internal System.Windows.Forms.DateTimePicker txtfecha;
        internal System.Windows.Forms.TextBox txtagregar;
        internal System.Windows.Forms.Label Label5;
        internal System.Windows.Forms.Label Label43;
        internal System.Windows.Forms.TextBox TXTBUSCARProducto;
        internal System.Windows.Forms.Label Label42;
        internal System.Windows.Forms.Label Label44;
        internal System.Windows.Forms.Label Label32;
        internal System.Windows.Forms.ComboBox ComboBox1;
        internal System.Windows.Forms.Label Label41;
        internal System.Windows.Forms.Label label1;
        private System.Windows.Forms.DataGridViewCheckBoxColumn DataGridViewCheckBoxColumn1;
    }
}