// BTS Management Models

export interface BtsStation {
    id: string;
    stationName: string;
    region: string;
    division: string;
    startDate: string;
    endDate: string;
    operatingHours: string;
    status: 'ON' | 'OFF';
    scheduleStatus: 'Schedule' | 'Manual';
    // Additional fields that might be needed
    latitude?: number;
    longitude?: number;
    signalStrength?: number;
    lastMaintenance?: string;
    nextMaintenance?: string;
    powerConsumption?: number;
    temperature?: number;
    humidity?: number;
}

export interface BtsStatsData {
    active: number;
    inactive: number;
    schedule: number;
    manual: number;
    total: number;
    maintenance: number;
    error: number;
}

export interface BtsFilterOptions {
    divisions: string[];
    statuses: string[];
    scheduleStatuses: string[];
    regions: string[];
}

export interface BtsFilterCriteria {
    search?: string;
    division?: string;
    status?: string;
    scheduleStatus?: string;
    region?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface BtsStationsResponse {
    stations: BtsStation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BtsStationDetails extends BtsStation {
    // Detailed information for individual station view
    description?: string;
    address?: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    installationDate?: string;
    warrantyExpiry?: string;
    specifications?: BtsSpecifications;
    performance?: BtsPerformance;
    alerts?: BtsAlert[];
}

export interface BtsSpecifications {
    model: string;
    manufacturer: string;
    frequency: string;
    powerOutput: number;
    antennaGain: number;
    coverageRadius: number;
    maxConnections: number;
}

export interface BtsPerformance {
    uptime: number;
    signalQuality: number;
    dataThroughput: number;
    errorRate: number;
    lastUpdated: string;
}

export interface BtsAlert {
    id: string;
    stationId: string;
    type: 'WARNING' | 'ERROR' | 'INFO';
    message: string;
    timestamp: string;
    resolved: boolean;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface BtsMaintenanceRecord {
    id: string;
    stationId: string;
    type: 'ROUTINE' | 'REPAIR' | 'UPGRADE' | 'INSPECTION';
    description: string;
    technician: string;
    startDate: string;
    endDate: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    cost?: number;
    notes?: string;
}

export interface BtsReport {
    id: string;
    title: string;
    type: 'STATUS' | 'PERFORMANCE' | 'MAINTENANCE' | 'CUSTOM';
    generatedAt: string;
    generatedBy: string;
    data: any;
    format: 'PDF' | 'EXCEL' | 'CSV';
    status: 'GENERATING' | 'READY' | 'FAILED';
    downloadUrl?: string;
}
