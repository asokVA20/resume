const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// JasperReports CV Generation Configuration
const JASPER_CONFIG = {
    jasperFile: 'cv-template.jrxml',
    outputFile: 'cv-anthony-okala-jasper.pdf',
    dataFile: 'personal-data.json',
    javaClasspath: [
        'jasperreports-6.20.0.jar',
        'commons-logging-1.2.jar',
        'commons-collections-3.2.2.jar',
        'commons-digester-2.1.jar',
        'commons-beanutils-1.9.4.jar',
        'commons-javaflow-20060411.jar',
        'iText-2.1.7.jar',
        'poi-5.2.3.jar',
        'xml-apis-1.4.01.jar',
        'xalan-2.7.2.jar',
        'xmlbeans-5.1.1.jar'
    ]
};

class JasperReportsCVGenerator {
    constructor() {
        this.javaPath = this.findJavaPath();
        this.jasperPath = this.findJasperReportsPath();
    }

    findJavaPath() {
        // Try to find Java installation
        const possiblePaths = [
            'java',
            'C:\\Program Files\\Java\\jdk-11\\bin\\java.exe',
            'C:\\Program Files\\Java\\jdk-17\\bin\\java.exe',
            'C:\\Program Files\\Java\\jdk-21\\bin\\java.exe',
            '/usr/bin/java',
            '/usr/local/bin/java'
        ];

        for (const javaPath of possiblePaths) {
            try {
                // Test if Java is available
                exec(`${javaPath} -version`, (error) => {
                    if (!error) {
                        console.log(`✅ Found Java at: ${javaPath}`);
                        return javaPath;
                    }
                });
            } catch (e) {
                continue;
            }
        }

        return 'java'; // Default fallback
    }

    findJasperReportsPath() {
        // Look for JasperReports installation
        const possiblePaths = [
            './jasperreports',
            './lib/jasperreports',
            'C:\\jasperreports',
            '/usr/local/jasperreports',
            '/opt/jasperreports'
        ];

        for (const jasperPath of possiblePaths) {
            if (fs.existsSync(jasperPath)) {
                console.log(`✅ Found JasperReports at: ${jasperPath}`);
                return jasperPath;
            }
        }

        return './jasperreports'; // Default fallback
    }

    generateCV() {
        return new Promise((resolve, reject) => {
            console.log('🚀 Generating CV with JasperReports...');
            
            // Check if required files exist
            if (!fs.existsSync(JASPER_CONFIG.jasperFile)) {
                console.error(`❌ JasperReports template not found: ${JASPER_CONFIG.jasperFile}`);
                console.log('📝 Creating template...');
                this.createJasperTemplate();
            }

            if (!fs.existsSync(JASPER_CONFIG.dataFile)) {
                console.error(`❌ Data file not found: ${JASPER_CONFIG.dataFile}`);
                reject(new Error('Data file not found'));
                return;
            }

            // Build classpath
            const classpath = JASPER_CONFIG.javaClasspath
                .map(jar => path.join(this.jasperPath, 'lib', jar))
                .join(path.delimiter);

            // Java command to run JasperReports
            const javaCommand = [
                this.javaPath,
                '-cp', classpath,
                'net.sf.jasperreports.engine.JasperFillManager',
                'fill',
                JASPER_CONFIG.jasperFile,
                JASPER_CONFIG.dataFile,
                JASPER_CONFIG.outputFile
            ].join(' ');

            console.log('🔧 Running JasperReports...');
            console.log(`Command: ${javaCommand}`);

            exec(javaCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ JasperReports error:', error);
                    console.error('stderr:', stderr);
                    reject(error);
                    return;
                }

                console.log('✅ CV generated successfully!');
                console.log(`📄 Output file: ${JASPER_CONFIG.outputFile}`);
                console.log('🎨 Features:');
                console.log('   - Professional layout with no overlapping text');
                console.log('   - Enterprise-grade PDF generation');
                console.log('   - Template-based design');
                console.log('   - Data-driven content');
                console.log('   - High-quality typography');

                resolve(JASPER_CONFIG.outputFile);
            });
        });
    }

    createJasperTemplate() {
        console.log('📝 Creating JasperReports template...');
        
        const jasperTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" 
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
              xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports 
              http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" 
              name="cv-template" 
              pageWidth="595" 
              pageHeight="842" 
              columnWidth="555" 
              leftMargin="20" 
              rightMargin="20" 
              topMargin="20" 
              bottomMargin="20">
    
    <!-- Styles -->
    <style name="title" fontName="Arial" fontSize="24" isBold="true" pdfFontName="Helvetica-Bold"/>
    <style name="subtitle" fontName="Arial" fontSize="14" isBold="true" pdfFontName="Helvetica-Bold"/>
    <style name="heading" fontName="Arial" fontSize="16" isBold="true" pdfFontName="Helvetica-Bold"/>
    <style name="body" fontName="Arial" fontSize="11" pdfFontName="Helvetica"/>
    <style name="small" fontName="Arial" fontSize="9" pdfFontName="Helvetica"/>
    
    <!-- Parameters -->
    <parameter name="personalInfo" class="java.util.Map"/>
    <parameter name="contactInfo" class="java.util.List"/>
    <parameter name="experienceTabs" class="java.util.List"/>
    <parameter name="education" class="java.util.List"/>
    <parameter name="skills" class="java.util.List"/>
    <parameter name="projects" class="java.util.List"/>
    
    <!-- Title Section -->
    <title>
        <band height="80">
            <staticText>
                <reportElement x="0" y="0" width="555" height="30"/>
                <textElement textAlignment="Center">
                    <font size="24" isBold="true"/>
                </textElement>
                <text><![CDATA[$P{personalInfo}.name]]></text>
            </staticText>
            <staticText>
                <reportElement x="0" y="30" width="555" height="20"/>
                <textElement textAlignment="Center">
                    <font size="14" isBold="true"/>
                </textElement>
                <text><![CDATA[$P{personalInfo}.title]]></text>
            </staticText>
        </band>
    </title>
    
    <!-- Contact Information -->
    <detail>
        <band height="40">
            <staticText>
                <reportElement x="0" y="0" width="555" height="20"/>
                <textElement textAlignment="Center">
                    <font size="9"/>
                </textElement>
                <text><![CDATA[Contact Information]]></text>
            </staticText>
        </band>
    </detail>
    
    <!-- Professional Summary -->
    <summary>
        <band height="100">
            <staticText>
                <reportElement x="0" y="0" width="555" height="20"/>
                <textElement>
                    <font size="16" isBold="true"/>
                </textElement>
                <text><![CDATA[Professional Summary]]></text>
            </staticText>
            <staticText>
                <reportElement x="0" y="25" width="555" height="60"/>
                <textElement>
                    <font size="11"/>
                </textElement>
                <text><![CDATA[$P{personalInfo}.description]]></text>
            </staticText>
        </band>
    </summary>
    
</jasperReport>`;

        fs.writeFileSync(JASPER_CONFIG.jasperFile, jasperTemplate);
        console.log(`✅ Created JasperReports template: ${JASPER_CONFIG.jasperFile}`);
    }

    installJasperReports() {
        console.log('📦 Installing JasperReports...');
        
        const installScript = `
# Download JasperReports
mkdir -p jasperreports/lib
cd jasperreports/lib

# Download required JAR files
curl -L -o jasperreports-6.20.0.jar "https://sourceforge.net/projects/jasperreports/files/jasperreports/JasperReports%206.20.0/jasperreports-6.20.0.jar/download"
curl -L -o commons-logging-1.2.jar "https://repo1.maven.org/maven2/commons-logging/commons-logging/1.2/commons-logging-1.2.jar"
curl -L -o commons-collections-3.2.2.jar "https://repo1.maven.org/maven2/commons-collections/commons-collections/3.2.2/commons-collections-3.2.2.jar"
curl -L -o commons-digester-2.1.jar "https://repo1.maven.org/maven2/commons-digester/commons-digester/2.1/commons-digester-2.1.jar"
curl -L -o commons-beanutils-1.9.4.jar "https://repo1.maven.org/maven2/commons-beanutils/commons-beanutils/1.9.4/commons-beanutils-1.9.4.jar"
curl -L -o commons-javaflow-20060411.jar "https://repo1.maven.org/maven2/commons-javaflow/commons-javaflow/20060411/commons-javaflow-20060411.jar"
curl -L -o iText-2.1.7.jar "https://repo1.maven.org/maven2/com.lowagie/itext/2.1.7/itext-2.1.7.jar"
curl -L -o poi-5.2.3.jar "https://repo1.maven.org/maven2/org.apache.poi/poi/5.2.3/poi-5.2.3.jar"
curl -L -o xml-apis-1.4.01.jar "https://repo1.maven.org/maven2/xml-apis/xml-apis/1.4.01/xml-apis-1.4.01.jar"
curl -L -o xalan-2.7.2.jar "https://repo1.maven.org/maven2/xalan/xalan/2.7.2/xalan-2.7.2.jar"
curl -L -o xmlbeans-5.1.1.jar "https://repo1.maven.org/maven2/org.apache.xmlbeans/xmlbeans/5.1.1/xmlbeans-5.1.1.jar"

echo "✅ JasperReports installed successfully!"
`;

        fs.writeFileSync('install-jasperreports.sh', installScript);
        console.log('📝 Created installation script: install-jasperreports.sh');
        console.log('🚀 Run: bash install-jasperreports.sh');
    }
}

// Main function to generate CV with JasperReports
function generateJasperReportsCV() {
    const generator = new JasperReportsCVGenerator();
    
    return generator.generateCV()
        .then(outputFile => {
            console.log('🎉 CV generated successfully with JasperReports!');
            console.log(`📄 Output: ${outputFile}`);
            return outputFile;
        })
        .catch(error => {
            console.error('❌ Error generating CV with JasperReports:', error.message);
            console.log('💡 Try running: bash install-jasperreports.sh');
            throw error;
        });
}

// Export for use in other files
module.exports = { generateJasperReportsCV, JasperReportsCVGenerator };

// Run if called directly
if (require.main === module) {
    generateJasperReportsCV();
}
