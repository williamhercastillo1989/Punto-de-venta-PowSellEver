using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

using System.Data.SqlClient;
using System.IO;
using SpreadsheetLight;
using System.Threading;
namespace Ada369Csharp.Presentacion.PRODUCTOS_OK
{
    public partial class Asistente_de_importacionExcel : Form
    {
        private int idGroup = 0;
        public Asistente_de_importacionExcel()
        {
            InitializeComponent();
        }

        private void panel7_Paint(object sender, PaintEventArgs e)
        {

        }

        private void LinkLabel2_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            try
            {
                string ruta;
                if (folderBrowserDialog1.ShowDialog() == DialogResult.OK)
                {
                    ruta = folderBrowserDialog1.SelectedPath + "\\ProductosAdd.xlsx";
                    SLDocument NombredeExcel = new SLDocument();
                    System.Data.DataTable dt = new System.Data.DataTable();
                    dt.Columns.Add("Descripcion", typeof(string));
                    dt.Columns.Add("Codigo", typeof(string));
                    dt.Columns.Add("PrecioCompra", typeof(string));
                    dt.Columns.Add("PrecioVenta", typeof(string));
                    dt.Columns.Add("Stock", typeof(string));
                    dt.Columns.Add("StockMinimo", typeof(string));
                    dt.Columns.Add("Se_vende_a",typeof(string));
                    NombredeExcel.ImportDataTable(1, 1, dt, true);
                    NombredeExcel.SaveAs(ruta);
                    MessageBox.Show("Plantilla Obtenida ubicala en: " + ruta, "Archivo Excel Creado", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.StackTrace);
            }
        }

        private void TSIGUIENTE_Y_GUARDAR__Click(object sender, EventArgs e)
        {
            PanelDescarga_de_archivo.Visible = false;
            PanelCargarArchivo.Visible = true;
            B1.Enabled = false;
            B2.Enabled = true;
            B3.Enabled = false;
            Paso1.Visible = false;
            Paso2.Visible = true;
            Paso3.Visible = false;
        }

        private void archivo_correcto()
        {
            PanelCargarArchivo.BackColor = Color.White;
            lblarchivoCargado.Visible = true;
           label3.Visible = false;
            MenuStrip1.Visible = true;
            Pcsv.Visible = true;
            LinkLabel3.LinkColor  = Color.Black;
            lblnombre_Del_archivo.ForeColor = Color.FromArgb(64, 64, 64);
            PanelCargarArchivo.BackgroundImage = null;
 
        }

        private void LinkLabel3_LinkClicked_1(object sender, LinkLabelLinkClickedEventArgs e)
        {
            OpenFileDialog myFileDialog = new OpenFileDialog();
            myFileDialog.InitialDirectory = @"c:\\temp\";
            myFileDialog.Filter = "CSV files|*.csv;*.CSV)";
            myFileDialog.FilterIndex = 2;
            myFileDialog.RestoreDirectory = true;
            myFileDialog.Title = "Elija el Archivo .CSV";
            if (myFileDialog.ShowDialog() == DialogResult.OK)
            {
                lblnombre_Del_archivo.Text = myFileDialog.SafeFileName.ToString();
                lblArchivoListo.Text = lblnombre_Del_archivo.Text;
                lblRuta.Text = myFileDialog.FileName.ToString();
                archivo_correcto();
            }
        }

        private void PanelCargarArchivo_DragEnter(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop ))
            {
                e.Effect = DragDropEffects.Copy;
            }
        }

        private void PanelCargarArchivo_DragDrop(object sender, DragEventArgs e)
        {
            string[] files = (String[])e.Data.GetData(DataFormats.FileDrop, false);
            foreach ( string path in files )
            {
                lblRuta.Text = path;
                string ruta = lblRuta.Text;
                if (ruta.Contains(".csv"))
                {
                    archivo_correcto();
                    lblnombre_Del_archivo.Text = Path.GetFileName(ruta);
                    lblArchivoListo.Text = lblnombre_Del_archivo.Text;
                }
                else
                {
                    MessageBox.Show("Archivo Incorrecto", "Formato incorrecto", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                }

            }
        }

        private void Asistente_de_importacionExcel_Load(object sender, EventArgs e)
        {
            B1.Enabled = true;
            B2.Enabled = false;
            B3.Enabled = false;
            Paso1.Visible = true;
            Paso2.Visible = false;
            Paso3.Visible = false;
        }

        private void ToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            PanelCargarArchivo.Visible = false;
            PanelGuardarData.Visible = true;
            B1.Enabled = false;
            B2.Enabled = false;
            B3.Enabled = true;
            Paso1.Visible = false;
            Paso2.Visible = false;
            Paso3.Visible = true;
        }

        private void Label11_Click(object sender, EventArgs e)
        {
            guardar_datos_Precargados();
        }

        private void GroupInsertValidate(string group)
        {
           
            Buscar_id_GRUPOS(group);

            if (idGroup == 0)
            {
                SqlConnection con = new SqlConnection();
                con.ConnectionString = CONEXION.CONEXIONMAESTRA.conexion;
                con.Open();
                SqlCommand cmd = new SqlCommand();
                cmd = new SqlCommand("insertar_Grupo", con);
                cmd.CommandType = CommandType.StoredProcedure;



                cmd.Parameters.AddWithValue("@Grupo", group);
                cmd.Parameters.AddWithValue("@Por_defecto", "NO");
                cmd.ExecuteNonQuery();
                con.Close();
            } 

        }

     

        internal void Buscar_id_GRUPOS(string group)
        {

            string resultado;
            string queryGroup;
            queryGroup = "Buscar_id_GRUPOS";
            SqlConnection con = new SqlConnection();
            con.ConnectionString = CONEXION.CONEXIONMAESTRA.conexion;

            SqlCommand comMoneda = new SqlCommand(queryGroup, con);
            comMoneda.CommandType = CommandType.StoredProcedure;
            comMoneda.Parameters.AddWithValue("@Linea", group);
            try
            {
                con.Open();
                resultado = Convert.ToString(comMoneda.ExecuteScalar()); //asignamos el valor del importe
                idGroup = Convert.ToInt32(resultado);
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                resultado = "";
            }
        }

        private void guardar_datos_Precargados()
        {
            string Textlines = "";
            string[] Splitline;
            if (System.IO.File.Exists(lblRuta.Text) == true)
            {
                System.IO.StreamReader objReader = new System.IO.StreamReader(lblRuta.Text);
                while (objReader.Peek() != -1)
                {
                    Textlines = objReader.ReadLine();
                    Splitline = Textlines.Split(';');
                    datalistado.ColumnCount = Splitline.Length;
                    datalistado.Rows.Add(Splitline);

                }
            }
            else
            {
                MessageBox.Show("Archivo Inexistente", "CSV Inexistente");
            }

            int count = 0;

            try
            {
                foreach (DataGridViewRow row in datalistado.Rows)
                {
                    rellenar_vacios();
                    if (count == 0)
                    {
                        count++;
                    }
                    else
                    {
                        string CODIGO = Convert.ToString(row.Cells["Codigo"].Value);
                        string descripcion = Convert.ToString(row.Cells["Descripcion"].Value);
                        decimal precioCompra = Convert.ToDecimal(row.Cells["PrecioCompra"].Value);
                        decimal precioVenta = Convert.ToDecimal(row.Cells["PrecioVenta"].Value);
                        string stock = Convert.ToString(row.Cells["Stock"].Value);
                        decimal stockMinimo = Convert.ToDecimal(row.Cells["StockMinimo"].Value);
                        string Se_vende_a = Convert.ToString(row.Cells["Se_vende_a"].Value);
                    
                        SqlCommand cmd;
                        CONEXION.CONEXIONMAESTRA.conectar.Open();
                        cmd = new SqlCommand("insertar_Producto_Importacion", CONEXION.CONEXIONMAESTRA.conectar);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Descripcion", descripcion);
                        cmd.Parameters.AddWithValue("@Imagen", ".");
                        cmd.Parameters.AddWithValue("@Usa_inventarios", "SI");
                        cmd.Parameters.AddWithValue("@Stock", stock);
                        cmd.Parameters.AddWithValue("@Precio_de_compra", precioCompra);
                        cmd.Parameters.AddWithValue("@Fecha_de_vencimiento", "NO APLICA");
                        cmd.Parameters.AddWithValue("@Precio_de_venta", precioVenta);
                        cmd.Parameters.AddWithValue("@Codigo", CODIGO);
                        cmd.Parameters.AddWithValue("@Se_vende_a", Se_vende_a);
                        cmd.Parameters.AddWithValue("@Impuesto", 0);
                        cmd.Parameters.AddWithValue("@Stock_minimo", stockMinimo);
                        cmd.Parameters.AddWithValue("@Precio_mayoreo", 0);
                        cmd.Parameters.AddWithValue("@A_partir_de", 0);
                        cmd.Parameters.AddWithValue("@Fecha", DateTime.Today);
                        cmd.Parameters.AddWithValue("@Motivo", "Registro inicial de Producto");
                        cmd.Parameters.AddWithValue("@Cantidad", Convert.ToDecimal(stock));
                        cmd.Parameters.AddWithValue("@Id_usuario", Productos_ok.idusuario);
                        cmd.Parameters.AddWithValue("@Tipo", "ENTRADA");
                        cmd.Parameters.AddWithValue("@Estado", "CONFIRMADO");
                        cmd.Parameters.AddWithValue("@Id_caja", Productos_ok.idcaja);
                        cmd.ExecuteNonQuery();
                        CONEXION.CONEXIONMAESTRA.conectar.Close();
                    }
                }
                count = 0;

                MessageBox.Show("Importacion Exitosa", "Importacion de Datos");
                Dispose();
            }
            catch (Exception ex)
            {
                count = 0;
                MessageBox.Show(ex.StackTrace);
            }
            
        }
        private void rellenar_vacios()
        {
            foreach (DataGridViewRow row in datalistado.Rows )
            {
                if (row.Cells ["Descripcion"].Value.ToString ()=="")
                {
                    row.Cells["Descripcion"].Value = "VACIO@";
                }
                else if (row.Cells ["Codigo"].Value.ToString ()=="")
                {
                    row.Cells["Codigo"].Value = "VACIO@";
                }
                else if (row.Cells["PrecioCompra"].Value.ToString() == "")
                {
                    row.Cells["PrecioCompra"].Value = "VACIO@";
                }
                else if (row.Cells["PrecioVenta"].Value.ToString() == "")
                {
                    row.Cells["PrecioVenta"].Value = "VACIO@";
                }
                else if (row.Cells["Stock"].Value.ToString() == "")
                {
                    row.Cells["Stock"].Value = "VACIO@";
                }
                else if (row.Cells["StockMinimo"].Value.ToString() == "")
                {
                    row.Cells["StockMinimo"].Value = "VACIO@";
                }
            }
        }

        private void PictureBox2_Click(object sender, EventArgs e)
        {

        }
    }
}
