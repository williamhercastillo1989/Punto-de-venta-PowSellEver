namespace Ada369Csharp.Presentacion.Conexion_remota
{
    partial class Caja_secundaria
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Caja_secundaria));
            this.Panel7 = new System.Windows.Forms.Panel();
            this.Panel3 = new System.Windows.Forms.Panel();
            this.TSIGUIENTE_Y_GUARDAR = new System.Windows.Forms.MenuStrip();
            this.btnguardar = new System.Windows.Forms.ToolStripMenuItem();
            this.btncancelar = new System.Windows.Forms.ToolStripMenuItem();
            this.Panel17 = new System.Windows.Forms.Panel();
            this.txtcaja = new System.Windows.Forms.TextBox();
            this.Label19 = new System.Windows.Forms.Label();
            this.datalistadocajas = new System.Windows.Forms.DataGridView();
            this.DataGridViewCheckBoxColumn1 = new System.Windows.Forms.DataGridViewCheckBoxColumn();
            this.Panel3.SuspendLayout();
            this.TSIGUIENTE_Y_GUARDAR.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.datalistadocajas)).BeginInit();
            this.SuspendLayout();
            // 
            // Panel7
            // 
            this.Panel7.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(5)))), ((int)(((byte)(65)))), ((int)(((byte)(181)))));
            this.Panel7.Dock = System.Windows.Forms.DockStyle.Top;
            this.Panel7.Location = new System.Drawing.Point(0, 0);
            this.Panel7.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Panel7.Name = "Panel7";
            this.Panel7.Size = new System.Drawing.Size(915, 287);
            this.Panel7.TabIndex = 607;
            // 
            // Panel3
            // 
            this.Panel3.BackColor = System.Drawing.Color.White;
            this.Panel3.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.Panel3.Controls.Add(this.TSIGUIENTE_Y_GUARDAR);
            this.Panel3.Controls.Add(this.Panel17);
            this.Panel3.Controls.Add(this.txtcaja);
            this.Panel3.Controls.Add(this.Label19);
            this.Panel3.Controls.Add(this.datalistadocajas);
            this.Panel3.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F);
            this.Panel3.Location = new System.Drawing.Point(83, 352);
            this.Panel3.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Panel3.Name = "Panel3";
            this.Panel3.Size = new System.Drawing.Size(751, 119);
            this.Panel3.TabIndex = 608;
            // 
            // TSIGUIENTE_Y_GUARDAR
            // 
            this.TSIGUIENTE_Y_GUARDAR.AutoSize = false;
            this.TSIGUIENTE_Y_GUARDAR.BackColor = System.Drawing.Color.Transparent;
            this.TSIGUIENTE_Y_GUARDAR.Dock = System.Windows.Forms.DockStyle.None;
            this.TSIGUIENTE_Y_GUARDAR.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.TSIGUIENTE_Y_GUARDAR.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.btnguardar,
            this.btncancelar});
            this.TSIGUIENTE_Y_GUARDAR.LayoutStyle = System.Windows.Forms.ToolStripLayoutStyle.HorizontalStackWithOverflow;
            this.TSIGUIENTE_Y_GUARDAR.Location = new System.Drawing.Point(469, 66);
            this.TSIGUIENTE_Y_GUARDAR.Name = "TSIGUIENTE_Y_GUARDAR";
            this.TSIGUIENTE_Y_GUARDAR.ShowItemToolTips = true;
            this.TSIGUIENTE_Y_GUARDAR.Size = new System.Drawing.Size(268, 39);
            this.TSIGUIENTE_Y_GUARDAR.TabIndex = 584;
            this.TSIGUIENTE_Y_GUARDAR.Text = "MenuStrip4";
            // 
            // btnguardar
            // 
            this.btnguardar.BackColor = System.Drawing.Color.Gainsboro;
            this.btnguardar.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.btnguardar.ForeColor = System.Drawing.Color.Black;
            this.btnguardar.Image = ((System.Drawing.Image)(resources.GetObject("btnguardar.Image")));
            this.btnguardar.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.btnguardar.Name = "btnguardar";
            this.btnguardar.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
            this.btnguardar.Size = new System.Drawing.Size(120, 35);
            this.btnguardar.Text = "Siguiente";
            this.btnguardar.Click += new System.EventHandler(this.btnguardar_Click);
            // 
            // btncancelar
            // 
            this.btncancelar.BackColor = System.Drawing.Color.Transparent;
            this.btncancelar.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.btncancelar.ForeColor = System.Drawing.Color.Black;
            this.btncancelar.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.btncancelar.Name = "btncancelar";
            this.btncancelar.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
            this.btncancelar.Size = new System.Drawing.Size(92, 35);
            this.btncancelar.Text = "Cancelar";
            this.btncancelar.Click += new System.EventHandler(this.btncancelar_Click);
            // 
            // Panel17
            // 
            this.Panel17.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(204)))), ((int)(((byte)(1)))));
            this.Panel17.Location = new System.Drawing.Point(115, 42);
            this.Panel17.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Panel17.Name = "Panel17";
            this.Panel17.Size = new System.Drawing.Size(533, 2);
            this.Panel17.TabIndex = 558;
            // 
            // txtcaja
            // 
            this.txtcaja.BackColor = System.Drawing.Color.White;
            this.txtcaja.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txtcaja.CharacterCasing = System.Windows.Forms.CharacterCasing.Upper;
            this.txtcaja.Cursor = System.Windows.Forms.Cursors.Hand;
            this.txtcaja.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.txtcaja.ForeColor = System.Drawing.Color.Black;
            this.txtcaja.Location = new System.Drawing.Point(115, 14);
            this.txtcaja.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.txtcaja.Name = "txtcaja";
            this.txtcaja.Size = new System.Drawing.Size(533, 27);
            this.txtcaja.TabIndex = 532;
            this.txtcaja.Text = "NOMBRE DE CAJA";
            // 
            // Label19
            // 
            this.Label19.AutoSize = true;
            this.Label19.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold);
            this.Label19.ForeColor = System.Drawing.Color.Black;
            this.Label19.Location = new System.Drawing.Point(28, 15);
            this.Label19.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.Label19.Name = "Label19";
            this.Label19.Size = new System.Drawing.Size(77, 25);
            this.Label19.TabIndex = 556;
            this.Label19.Text = "CAJA:";
            // 
            // datalistadocajas
            // 
            this.datalistadocajas.AllowUserToAddRows = false;
            this.datalistadocajas.AllowUserToDeleteRows = false;
            this.datalistadocajas.BackgroundColor = System.Drawing.Color.White;
            this.datalistadocajas.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.datalistadocajas.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.None;
            this.datalistadocajas.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.datalistadocajas.ColumnHeadersVisible = false;
            this.datalistadocajas.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.DataGridViewCheckBoxColumn1});
            this.datalistadocajas.EnableHeadersVisualStyles = false;
            this.datalistadocajas.Location = new System.Drawing.Point(495, 20);
            this.datalistadocajas.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.datalistadocajas.Name = "datalistadocajas";
            this.datalistadocajas.ReadOnly = true;
            this.datalistadocajas.RowHeadersWidth = 5;
            this.datalistadocajas.RowTemplate.DefaultCellStyle.SelectionBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(224)))), ((int)(((byte)(224)))), ((int)(((byte)(224)))));
            this.datalistadocajas.RowTemplate.DefaultCellStyle.SelectionForeColor = System.Drawing.Color.Black;
            this.datalistadocajas.RowTemplate.Height = 40;
            this.datalistadocajas.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.datalistadocajas.Size = new System.Drawing.Size(68, 12);
            this.datalistadocajas.TabIndex = 557;
            // 
            // DataGridViewCheckBoxColumn1
            // 
            this.DataGridViewCheckBoxColumn1.HeaderText = "Eliminar";
            this.DataGridViewCheckBoxColumn1.MinimumWidth = 6;
            this.DataGridViewCheckBoxColumn1.Name = "DataGridViewCheckBoxColumn1";
            this.DataGridViewCheckBoxColumn1.ReadOnly = true;
            this.DataGridViewCheckBoxColumn1.Visible = false;
            this.DataGridViewCheckBoxColumn1.Width = 125;
            // 
            // Caja_secundaria
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(915, 602);
            this.Controls.Add(this.Panel3);
            this.Controls.Add(this.Panel7);
            this.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Name = "Caja_secundaria";
            this.Text = "Caja_secundaria";
            this.Load += new System.EventHandler(this.Caja_secundaria_Load);
            this.Panel3.ResumeLayout(false);
            this.Panel3.PerformLayout();
            this.TSIGUIENTE_Y_GUARDAR.ResumeLayout(false);
            this.TSIGUIENTE_Y_GUARDAR.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.datalistadocajas)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        internal System.Windows.Forms.Panel Panel7;
        internal System.Windows.Forms.Panel Panel3;
        internal System.Windows.Forms.Panel Panel17;
        internal System.Windows.Forms.TextBox txtcaja;
        internal System.Windows.Forms.Label Label19;
        internal System.Windows.Forms.DataGridView datalistadocajas;
        internal System.Windows.Forms.DataGridViewCheckBoxColumn DataGridViewCheckBoxColumn1;
        internal System.Windows.Forms.MenuStrip TSIGUIENTE_Y_GUARDAR;
        internal System.Windows.Forms.ToolStripMenuItem btnguardar;
        internal System.Windows.Forms.ToolStripMenuItem btncancelar;
    }
}