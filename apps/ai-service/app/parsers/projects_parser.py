from dataclasses import dataclass, field
from enum import Enum

@dataclass
class Project:

    title: str = ""

    technologies: list = field(default_factory=list)

    description: list = field(default_factory=list)




class ParserState(Enum):

    LOOKING_FOR_TITLE = 1

    LOOKING_FOR_LINK = 2

    LOOKING_FOR_TECH = 3

    READING_DESCRIPTION = 4


class ProjectParser:

    def __init__(self, text):

        self.lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        self.projects = []

        self.current = None

        self.state = ParserState.LOOKING_FOR_TITLE

        self.index = 0

    def current_line(self):

        if self.index >= len(self.lines):
            return None

        return self.lines[self.index]


    def next_line(self):

        self.index += 1

        return self.current_line()


    def eof(self):

        return self.index >= len(self.lines)

    def is_bullet(self, line):

        if line is None:
            return False

        return line.startswith(("•", "-", "*", "▪", "◦", "●"))


    def clean_bullet(self, line):

        return line.lstrip("•-*▪◦● ").strip()


    def is_github(self, line):

        if line is None:
            return False

        return "github" in line.lower()


    def is_section_end(self, line):

        if line is None:
            return True

        headers = [
            "leadership",
            "leadership & certifications",
            "certifications",
            "certification",
            "languages",
            "achievements",
            "awards",
        ]

        lower = line.lower()

        return lower.strip() in headers

    TECH_KEYWORDS = {
        "python",
        "java",
        "c",
        "c++",
        "javascript",
        "react",
        "react.js",
        "next.js",
        "node.js",
        "express",
        "fastapi",
        "flask",
        "mongodb",
        "mysql",
        "postgresql",
        "sqlite",
        "tensorflow",
        "keras",
        "opencv",
        "pandas",
        "numpy",
        "scikit-learn",
        "langchain",
        "llms",
        "gemini",
        "docker",
        "aws",
        "azure",
        "html",
        "css",
        "rag",
        "faiss",
        "chromadb",
    }

    def is_technology_line(self, line):

        if line is None:
            return False

        lower = line.lower()

        count = 0

        for tech in self.TECH_KEYWORDS:

            if tech in lower:
                count += 1

        return count >= 2

    def is_project_title(self, line):

        if line is None:
            return False

        if self.is_section_end(line):
            return False

        if self.is_bullet(line):
            return False

        if self.is_github(line):
            return False

        if self.is_technology_line(line):
            return False

        if len(line) > 90:
            return False

        return True

    def save_project(self):

        if self.current is None:
            return

        # Remove empty technologies
        self.current.technologies = [
            tech.strip()
            for tech in self.current.technologies
            if tech.strip()
        ]

        # Remove empty descriptions
        self.current.description = [
            desc.strip()
            for desc in self.current.description
            if desc.strip()
        ]

        self.projects.append(
            {
                "title": self.current.title,
                "technologies": self.current.technologies,
                "description": self.current.description,
            }
        )

        self.current = None

    def start_project(self, title):

        self.current = Project()

        self.current.title = title

        self.state = ParserState.LOOKING_FOR_LINK

    def read_link(self):

        line = self.current_line()

        if line is None:
            return

        if self.is_github(line):

            self.next_line()

        self.state = ParserState.LOOKING_FOR_TECH

    def read_technology(self):

        line = self.current_line()

        if line is None:
            return

        if self.is_technology_line(line):

            self.current.technologies = [
                tech.strip()
                for tech in line.split(",")
                if tech.strip()
            ]

            self.next_line()

        self.state = ParserState.READING_DESCRIPTION

    def read_description(self):

        while not self.eof():

            line = self.current_line()

            # End of Projects section
            if self.is_section_end(line):

                self.save_project()

                return

            # New Project begins
            if (
                self.is_project_title(line)
                and len(self.current.description) > 0
            ):

                self.save_project()

                self.start_project(line)

                self.next_line()

                return

            # Bullet
            if self.is_bullet(line):

                bullet = self.clean_bullet(line)

                self.next_line()

                # Merge wrapped PDF lines
                while not self.eof():

                    nxt = self.current_line()

                    if (
                        self.is_bullet(nxt)
                        or self.is_project_title(nxt)
                        or self.is_section_end(nxt)
                    ):
                        break

                    bullet += " " + nxt

                    self.next_line()

                self.current.description.append(bullet)

                continue

            self.next_line()

    def parse(self):

        while not self.eof():

            line = self.current_line()

            # -----------------------------
            # Looking for a project title
            # -----------------------------
            if self.state == ParserState.LOOKING_FOR_TITLE:

                if self.is_section_end(line):
                    break

                if self.is_project_title(line):

                    self.start_project(line)

                    self.next_line()

                    continue

                self.next_line()
                continue

            # -----------------------------
            # Optional GitHub / Link
            # -----------------------------
            if self.state == ParserState.LOOKING_FOR_LINK:

                self.read_link()
                continue

            # -----------------------------
            # Technology Stack
            # -----------------------------
            if self.state == ParserState.LOOKING_FOR_TECH:

                self.read_technology()
                continue

            # -----------------------------
            # Description
            # -----------------------------
            if self.state == ParserState.READING_DESCRIPTION:

                self.read_description()

                # If description finished because of EOF
                if self.eof():
                    break

                continue

        # Save last project
        self.save_project()

        return self.projects



def extract_projects(text: str):

    parser = ProjectParser(text)

    return parser.parse()