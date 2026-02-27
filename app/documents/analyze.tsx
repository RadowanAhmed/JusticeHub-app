import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

interface AnalyzeProps {
    documentId?: string;
}

export const Analyze: React.FC<AnalyzeProps> = ({ documentId }) => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            // Add your analysis logic here
            setAnalysis('Analysis complete');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Document Analysis</Text>
            
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            
            {error && <Text style={styles.error}>{error}</Text>}
            
            {analysis && <Text style={styles.result}>{analysis}</Text>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    error: {
        color: 'red',
        marginTop: 8,
    },
    result: {
        marginTop: 16,
        fontSize: 14,
        lineHeight: 20,
    },
});