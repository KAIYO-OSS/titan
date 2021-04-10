import enum

class DeployWorkspace(enum.Enum):
    DeployWorkspaceAccepted = 0
    CreatingRG = 1
    CreatedRG = 2
    CreatingCluster = 4
    Completed = 5
    CreatingRGFailed = 6
    CreatingClusterFailed = 7

class DeleteWorkspace(enum.Enum):
    DeleteWorkspaceAccepted = 0
    DeletingCluster = 1
    DeletedCluster = 1
    DeletingRG = 2
    Deleted = 3
    ClusterDeleteFailed = 4
    RGDeleteFailed = 5

class DeployService(enum.Enum):
    DeployServiceAccepted = 0
    ConnectingToCluster = 1
    ClusterConnectionSuccess = 2
    ClusterConnectionFailed = 3
    DeployingService = 4
    DeployingServiceCompleted = 5
    CreatingDNSEntry = 6
    Completed = 7
    DeployingServiceFailed = 8
    CreatingDNSEntryFailed = 9

class UpdateService(enum.Enum):
    UpdateServiceAccepted = 0
    ConnectingToCluster = 1
    ClusterConnectionSuccess = 2
    ClusterConnectionFailed = 3
    UpdatingService = 4
    Completed = 5
    UpdateFailed = 6

class DeleteService(enum.Enum):
    DeleteServiceAccepted = 0
    ConnectingToCluster = 1
    ClusterConnectionSuccess = 2
    ClusterConnectionFailed = 3
    DeletingService = 4
    DeletedService = 5
    DNSEntryDelete = 6
    Deleted = 7
    DeletingServiceFailed = 8
    DNSEntryDeleteFailed = 9