// проект
type ProjectEntity = {
    id: string; // GUID
    name: string;
    description: string;
    creationDate: Date;
    sections: SectionEntity[];
    tagId: string; // GUID
    tag: TagEntity;
}

// раздел
type SectionEntity = {
    id: string; // GUID
    name: string;
    description: string;
    creationDate: Date;
    projectId: string; // GUID
    project: ProjectEntity;
    tasks: TaskEntity[];
    tagId: string; // GUID
    tag: TagEntity;
}

// задача
type TaskEntity = {
    id: string; // GUID
    name: string;
    description: string;
    isCompleted: boolean;
    creationDate: Date;
    placementDate: Date;
    recordedTimeInSecs: number; // секунды
    sectionId: string; // GUID
    section: SectionEntity;
    relatedTasks: TaskEntity[];
    tags: TagEntity[];
}

// тег
type TagEntity = {
    id: string; // GUID
    name: string;
}
