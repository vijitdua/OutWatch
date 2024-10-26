export function setAssociations(Service, ServiceUptime, BugReport) {
    Service.hasMany(ServiceUptime, { foreignKey: 'serviceId' });
    ServiceUptime.belongsTo(Service, { foreignKey: 'serviceId' });
    Service.hasMany(BugReport, { foreignKey: 'serviceId' });
    BugReport.belongsTo(Service, { foreignKey: 'serviceId' });
}
