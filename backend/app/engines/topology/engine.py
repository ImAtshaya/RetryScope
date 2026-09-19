import networkx as nx


class TopologyEngine:

    def __init__(self):
        self.graph = nx.DiGraph()

    def add_service(self, service_name):

        if service_name in self.graph:
            raise ValueError(
                f"Service '{service_name}' already exists"
            )

        self.graph.add_node(service_name)

    def add_dependency(self, source, target):

        if source not in self.graph:
            raise ValueError(
                f"Service '{source}' does not exist"
            )

        if target not in self.graph:
            raise ValueError(
                f"Service '{target}' does not exist"
            )

        self.graph.add_edge(source, target)

    def get_services(self):
        return list(self.graph.nodes)

    def get_dependencies(self):
        return list(self.graph.edges)

    def get_dependencies_for(self, service_name):

        if service_name not in self.graph:
            raise ValueError(
                f"Service '{service_name}' does not exist"
            )

        return list(
            self.graph.successors(service_name)
        )