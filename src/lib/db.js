import Dexie from 'dexie';

export const db = new Dexie('mce_projects');

db.version(1).stores({
  projects: 'id, updatedAt'
});

db.version(2).stores({
  projects: 'id, updatedAt, schemaVersion'
}).upgrade((tx) => tx.table('projects').toCollection().modify((project) => {
  if (!project.schemaVersion) project.schemaVersion = 2;
  if (!project.meta) project.meta = { createdAt: project.updatedAt ?? new Date().toISOString() };
}));

export const saveProject = async (project) => {
  const now = new Date().toISOString();
  const payload = {
    ...project,
    schemaVersion: 2,
    updatedAt: now,
    meta: project.meta ?? { createdAt: now }
  };
  if (!payload.id) payload.id = crypto.randomUUID();
  await db.projects.put(payload);
  return payload;
};

export const listProjects = () => db.projects.orderBy('updatedAt').reverse().toArray();
export const getProject = (id) => db.projects.get(id);
export const deleteProject = (id) => db.projects.delete(id);
