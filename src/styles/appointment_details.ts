// apps/mobile/src/styles/appointment-details.ts
import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './global';
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.md,
        fontWeight: 'bold',
        color: colors.text,
    },
    date: {
        fontSize: typography.sm,
        color: colors.textSecondary,
    },
    details: {
            
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...shadows.md,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    detailLabel: {
        fontSize: typography.sm,
        fontWeight: 'bold',
        color: colors.text,
    },
    detailValue: {
        fontSize: typography.sm,
        color: colors.textSecondary,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
    },
    buttonText: {
        fontSize: typography.md,
        color: colors.white,
        fontWeight: 'bold',
    },
});