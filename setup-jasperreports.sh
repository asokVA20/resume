#!/bin/bash

echo "🚀 Setting up JasperReports for CV Generation..."

# Create directories
mkdir -p jasperreports/lib
mkdir -p jasperreports/templates

# Download JasperReports JAR files
echo "📦 Downloading JasperReports JAR files..."

cd jasperreports/lib

# Download required JAR files
echo "⬇️  Downloading jasperreports-6.20.0.jar..."
curl -L -o jasperreports-6.20.0.jar "https://sourceforge.net/projects/jasperreports/files/jasperreports/JasperReports%206.20.0/jasperreports-6.20.0.jar/download"

echo "⬇️  Downloading commons-logging-1.2.jar..."
curl -L -o commons-logging-1.2.jar "https://repo1.maven.org/maven2/commons-logging/commons-logging/1.2/commons-logging-1.2.jar"

echo "⬇️  Downloading commons-collections-3.2.2.jar..."
curl -L -o commons-collections-3.2.2.jar "https://repo1.maven.org/maven2/commons-collections/commons-collections/3.2.2/commons-collections-3.2.2.jar"

echo "⬇️  Downloading commons-digester-2.1.jar..."
curl -L -o commons-digester-2.1.jar "https://repo1.maven.org/maven2/commons-digester/commons-digester/2.1/commons-digester-2.1.jar"

echo "⬇️  Downloading commons-beanutils-1.9.4.jar..."
curl -L -o commons-beanutils-1.9.4.jar "https://repo1.maven.org/maven2/commons-beanutils/commons-beanutils/1.9.4/commons-beanutils-1.9.4.jar"

echo "⬇️  Downloading commons-javaflow-20060411.jar..."
curl -L -o commons-javaflow-20060411.jar "https://repo1.maven.org/maven2/commons-javaflow/commons-javaflow/20060411/commons-javaflow-20060411.jar"

echo "⬇️  Downloading iText-2.1.7.jar..."
curl -L -o iText-2.1.7.jar "https://repo1.maven.org/maven2/com.lowagie/itext/2.1.7/itext-2.1.7.jar"

echo "⬇️  Downloading poi-5.2.3.jar..."
curl -L -o poi-5.2.3.jar "https://repo1.maven.org/maven2/org.apache.poi/poi/5.2.3/poi-5.2.3.jar"

echo "⬇️  Downloading xml-apis-1.4.01.jar..."
curl -L -o xml-apis-1.4.01.jar "https://repo1.maven.org/maven2/xml-apis/xml-apis/1.4.01/xml-apis-1.4.01.jar"

echo "⬇️  Downloading xalan-2.7.2.jar..."
curl -L -o xalan-2.7.2.jar "https://repo1.maven.org/maven2/xalan/xalan/2.7.2/xalan-2.7.2.jar"

echo "⬇️  Downloading xmlbeans-5.1.1.jar..."
curl -L -o xmlbeans-5.1.1.jar "https://repo1.maven.org/maven2/org.apache.xmlbeans/xmlbeans/5.1.1/xmlbeans-5.1.1.jar"

cd ../..

# Copy template
cp cv-template.jrxml jasperreports/templates/

echo "✅ JasperReports setup complete!"
echo ""
echo "🎯 Usage:"
echo "1. Compile the Java file: javac -cp 'jasperreports/lib/*' CVGenerator.java"
echo "2. Run the generator: java -cp '.:jasperreports/lib/*' CVGenerator"
echo ""
echo "📋 Features:"
echo "   - Professional layout with no overlapping text"
echo "   - Enterprise-grade PDF generation"
echo "   - Template-based design"
echo "   - Data-driven content"
echo "   - High-quality typography"
echo ""
echo "🚀 Ready to generate professional CVs!"
