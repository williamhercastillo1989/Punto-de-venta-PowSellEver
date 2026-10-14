# Alternativas a Telerik ReportViewer

Este documento describe alternativas al uso de Telerik ReportViewer para la visualización de reportes en el proyecto PowSellEver.

## Situación Actual

El proyecto actualmente utiliza **Telerik Reporting** (versión 10.0.16.204) con `Telerik.ReportViewer.WinForms.ReportViewer`. Esta es una solución comercial que requiere licencia.

## Alternativas Recomendadas

### 1. Microsoft ReportViewer (RDLC) ⭐ **RECOMENDADO**

**Ventajas:**
- ✅ **Gratuito** - Incluido con Visual Studio
- ✅ Ampliamente usado y documentado
- ✅ Integración nativa con Windows Forms
- ✅ Soporte para exportación a PDF, Excel, Word, etc.
- ✅ Diseñador visual integrado en Visual Studio
- ✅ No requiere licencias adicionales

**Desventajas:**
- ⚠️ Requiere migración de reportes existentes
- ⚠️ Menos características avanzadas que Telerik

**Instalación:**
```powershell
Install-Package Microsoft.ReportingServices.ReportViewerControl.WinForms
```

**Ejemplo de uso:**
```csharp
using Microsoft.Reporting.WinForms;

private void MostrarReporteRDLC()
{
    reportViewer1.LocalReport.ReportPath = @"Reportes\ResumenVentas.rdlc";
    reportViewer1.LocalReport.DataSources.Clear();
    reportViewer1.LocalReport.DataSources.Add(
        new ReportDataSource("DataSet1", dataTable));
    reportViewer1.RefreshReport();
}
```

**Migración:**
- Los reportes Telerik (.trdx) deben convertirse a RDLC (.rdlc)
- El diseñador de Visual Studio permite crear reportes RDLC visualmente

---

### 2. PDFSharp / MigraDoc

**Ventajas:**
- ✅ **Gratuito y Open Source**
- ✅ Genera PDFs directamente sin visor
- ✅ Control total sobre el diseño
- ✅ Ligero y rápido
- ✅ No requiere componentes visuales

**Desventajas:**
- ⚠️ No tiene visor integrado (genera PDFs directamente)
- ⚠️ Requiere más código para diseñar reportes
- ⚠️ No tiene diseñador visual

**Instalación:**
```powershell
Install-Package PdfSharp
Install-Package MigraDoc.DocumentObjectModel
```

**Ejemplo de uso:**
```csharp
using PdfSharp.Pdf;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;

private void GenerarPDFReporte(DataTable dt)
{
    Document document = new Document();
    Section section = document.AddSection();
    
    // Agregar tabla con datos
    Table table = section.AddTable();
    // ... configurar tabla
    
    PdfDocumentRenderer renderer = new PdfDocumentRenderer();
    renderer.Document = document;
    renderer.RenderDocument();
    renderer.PdfDocument.Save("reporte.pdf");
    
    // Abrir PDF
    System.Diagnostics.Process.Start("reporte.pdf");
}
```

---

### 3. Crystal Reports

**Ventajas:**
- ✅ Muy popular y maduro
- ✅ Diseñador visual potente
- ✅ Amplia funcionalidad

**Desventajas:**
- ❌ **Comercial** (aunque hay versión gratuita limitada)
- ❌ Más pesado que otras alternativas
- ❌ Puede ser más complejo de implementar

**Instalación:**
```powershell
Install-Package CrystalReports.Engine
```

---

### 4. DevExpress XtraReports

**Ventajas:**
- ✅ Muy potente y moderno
- ✅ Excelente diseñador visual
- ✅ Buen rendimiento

**Desventajas:**
- ❌ **Comercial** (muy costoso)
- ❌ Requiere licencia

---

### 5. Stimulsoft Reports

**Ventajas:**
- ✅ Diseñador visual moderno
- ✅ Buena documentación
- ✅ Soporte multiplataforma

**Desventajas:**
- ❌ **Comercial** (aunque hay versión gratuita limitada)

---

### 6. DataGridView con Exportación

**Ventajas:**
- ✅ **Gratuito** - Usa controles nativos de .NET
- ✅ Simple de implementar
- ✅ No requiere librerías adicionales

**Desventajas:**
- ⚠️ Limitado para reportes complejos
- ⚠️ No tiene diseñador visual
- ⚠️ Requiere más código para formateo

**Ejemplo:**
```csharp
// Mostrar en DataGridView
dataGridView1.DataSource = dataTable;

// Exportar a Excel usando librerías como ClosedXML
using ClosedXML.Excel;
var workbook = new XLWorkbook();
workbook.Worksheets.Add(dataTable, "Reporte");
workbook.SaveAs("reporte.xlsx");
```

---

## Recomendación Final

### Para migración completa:
**Microsoft ReportViewer (RDLC)** es la mejor opción porque:
1. Es gratuito y viene con Visual Studio
2. Tiene diseñador visual
3. Es ampliamente usado y documentado
4. Permite exportación a múltiples formatos
5. No requiere licencias

### Para solución rápida sin migración:
**PDFSharp/MigraDoc** es ideal si:
1. Solo necesitas generar PDFs
2. No necesitas visor integrado
3. Quieres control total sobre el diseño
4. Prefieres código sobre diseñadores visuales

### Para mantener similitud con Telerik:
Si el presupuesto lo permite, **DevExpress XtraReports** es la alternativa comercial más similar a Telerik.

---

## Plan de Migración Sugerido

1. **Fase 1: Preparación**
   - Instalar Microsoft ReportViewer
   - Crear reportes de prueba en RDLC
   - Adaptar ReportHelper para soportar ambos formatos

2. **Fase 2: Migración Gradual**
   - Migrar reportes más simples primero
   - Mantener Telerik para reportes complejos temporalmente
   - Probar cada reporte migrado

3. **Fase 3: Finalización**
   - Migrar todos los reportes restantes
   - Remover dependencias de Telerik
   - Actualizar documentación

---

## Notas Adicionales

- Los reportes actuales usan `DataTable` como fuente de datos, lo cual facilita la migración
- El `ReportHelper` creado puede adaptarse para soportar múltiples motores de reportes
- Considerar mantener una capa de abstracción para facilitar futuros cambios

---

## Referencias

- [Microsoft ReportViewer Documentation](https://docs.microsoft.com/en-us/sql/reporting-services/report-viewer-controls)
- [PDFSharp Documentation](https://www.pdfsharp.net/)
- [MigraDoc Documentation](https://www.pdfsharp.net/MigraDoc.ashx)

