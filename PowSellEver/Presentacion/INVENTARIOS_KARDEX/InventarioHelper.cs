using System;
using System.Data;
using System.Data.SqlClient;
using System.Windows.Forms;
using PowSellEver.Logica;

namespace PowSellEver.Presentacion.INVENTARIOS_KARDEX
{
    /// <summary>
    /// Clase helper para operaciones de inventario y kardex
    /// Reduce la duplicación de código y centraliza la lógica de consultas
    /// </summary>
    public static class InventarioHelper
    {
        /// <summary>
        /// Ejecuta un stored procedure y retorna un DataTable
        /// </summary>
        /// <param name="storedProcedureName">Nombre del stored procedure</param>
        /// <param name="parameters">Parámetros opcionales para el stored procedure</param>
        /// <returns>DataTable con los resultados</returns>
        public static DataTable EjecutarStoredProcedure(string storedProcedureName, params SqlParameter[] parameters)
        {
            DataTable dt = new DataTable();
            SqlConnection con = null;

            try
            {
                con = new SqlConnection();
                con.ConnectionString = CONEXION.CONEXIONMAESTRA.conexion;
                con.Open();

                using (SqlDataAdapter da = new SqlDataAdapter(storedProcedureName, con))
                {
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;
                    
                    if (parameters != null && parameters.Length > 0)
                    {
                        da.SelectCommand.Parameters.AddRange(parameters);
                    }

                    da.Fill(dt);
                }

                return dt;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al ejecutar la consulta: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
                return dt; // Retorna DataTable vacío en caso de error
            }
            finally
            {
                if (con != null && con.State == ConnectionState.Open)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Ejecuta una consulta SQL directa y retorna un DataTable
        /// </summary>
        /// <param name="query">Consulta SQL a ejecutar</param>
        /// <param name="parameters">Parámetros opcionales para la consulta</param>
        /// <returns>DataTable con los resultados</returns>
        public static DataTable EjecutarConsulta(string query, params SqlParameter[] parameters)
        {
            DataTable dt = new DataTable();
            SqlConnection con = null;

            try
            {
                con = new SqlConnection();
                con.ConnectionString = CONEXION.CONEXIONMAESTRA.conexion;
                con.Open();

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    if (parameters != null && parameters.Length > 0)
                    {
                        cmd.Parameters.AddRange(parameters);
                    }

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(dt);
                    }
                }

                return dt;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al ejecutar la consulta: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
                return dt;
            }
            finally
            {
                if (con != null && con.State == ConnectionState.Open)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Ejecuta un stored procedure y asigna el resultado a un DataGridView
        /// </summary>
        /// <param name="dataGridView">DataGridView donde se mostrarán los datos</param>
        /// <param name="storedProcedureName">Nombre del stored procedure</param>
        /// <param name="columnsToHide">Índices de columnas a ocultar (opcional)</param>
        /// <param name="parameters">Parámetros opcionales para el stored procedure</param>
        public static void CargarDatosEnDataGridView(DataGridView dataGridView, 
            string storedProcedureName, 
            int[] columnsToHide = null, 
            params SqlParameter[] parameters)
        {
            try
            {
                if (dataGridView == null)
                {
                    throw new ArgumentNullException(nameof(dataGridView), "El DataGridView no puede ser nulo");
                }

                DataTable dt = EjecutarStoredProcedure(storedProcedureName, parameters);

                if (dt != null && dt.Rows.Count > 0)
                {
                    dataGridView.DataSource = dt;

                    // Ocultar columnas especificadas
                    if (columnsToHide != null)
                    {
                        foreach (int columnIndex in columnsToHide)
                        {
                            if (columnIndex >= 0 && columnIndex < dataGridView.Columns.Count)
                            {
                                dataGridView.Columns[columnIndex].Visible = false;
                            }
                        }
                    }

                    // Aplicar formato multilínea
                    Bases.Multilinea(ref dataGridView);
                }
                else
                {
                    dataGridView.DataSource = null;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al cargar datos en el DataGridView: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Ejecuta un comando SQL y retorna un valor escalar
        /// </summary>
        /// <param name="query">Consulta SQL o nombre de stored procedure</param>
        /// <param name="parameters">Parámetros opcionales</param>
        /// <param name="isStoredProcedure">Indica si es un stored procedure (default: false)</param>
        /// <returns>Valor escalar como string, o string vacío si hay error</returns>
        public static string EjecutarEscalar(string query, SqlParameter[] parameters = null, bool isStoredProcedure = false)
        {
            SqlConnection con = null;

            try
            {
                con = new SqlConnection();
                con.ConnectionString = CONEXION.CONEXIONMAESTRA.conexion;
                con.Open();

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    if (isStoredProcedure)
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                    }

                    if (parameters != null && parameters.Length > 0)
                    {
                        cmd.Parameters.AddRange(parameters);
                    }

                    object result = cmd.ExecuteScalar();
                    return result != null ? Convert.ToString(result) : string.Empty;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al ejecutar la consulta: {ex.Message}", 
                    "Error", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Error);
                return string.Empty;
            }
            finally
            {
                if (con != null && con.State == ConnectionState.Open)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Valida que un DataTable tenga datos
        /// </summary>
        /// <param name="dataTable">El DataTable a validar</param>
        /// <returns>True si tiene datos, False si está vacío</returns>
        public static bool ValidarDatos(DataTable dataTable)
        {
            return dataTable != null && dataTable.Rows.Count > 0;
        }

        /// <summary>
        /// Crea un parámetro SQL de tipo string
        /// </summary>
        public static SqlParameter CrearParametro(string nombre, string valor)
        {
            return new SqlParameter(nombre, valor ?? string.Empty);
        }

        /// <summary>
        /// Crea un parámetro SQL de tipo int
        /// </summary>
        public static SqlParameter CrearParametro(string nombre, int valor)
        {
            return new SqlParameter(nombre, valor);
        }

        /// <summary>
        /// Crea un parámetro SQL de tipo DateTime
        /// </summary>
        public static SqlParameter CrearParametro(string nombre, DateTime valor)
        {
            return new SqlParameter(nombre, valor);
        }
    }
}

