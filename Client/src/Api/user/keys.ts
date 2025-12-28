export const userKeys = {
    getMe: ['user', 'me'] as const,
    getActivity: ['user', 'activity'] as const,
    toggleAttendance: ['user', 'attendance', 'toggle'] as const,
    createOrder: ['user', 'order'] as const,
    registerGuest: ['user', 'guest'] as const,
    changePassword: ['user', 'change-password'] as const,
}
