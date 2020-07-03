CREATE TABLE IF NOT EXISTS cloud.parts (
partId int NOT NULL,
partName VARCHAR(10) NOT NULL,
qty int NOT NULL,
PRIMARY KEY (partId));

INSERT INTO cloud.parts VALUES (1, 'part1', 100);
INSERT INTO cloud.parts VALUES (2, 'part2', 200);
INSERT INTO cloud.parts VALUES (3, 'part3', 300);

select * from cloud.parts;

CREATE TABLE IF NOT EXISTS cloud.jobs (
jobName VARCHAR(10) NOT NULL,
partId int NOT NULL,
qty int NOT NULL,
PRIMARY KEY (jobName, partId),
FOREIGN KEY(partId) REFERENCES parts(partId));

INSERT INTO cloud.jobs VALUES ('job1', 1, 1);
INSERT INTO cloud.jobs VALUES ('job1', 2, 1);
INSERT INTO cloud.jobs VALUES ('job2', 2, 2);
INSERT INTO cloud.jobs VALUES ('job2', 3, 2);
INSERT INTO cloud.jobs VALUES ('job3', 1, 3);
INSERT INTO cloud.jobs VALUES ('job3', 3, 3);

select * from cloud.jobs;

CREATE TABLE IF NOT EXISTS cloud.partOrdersX (
jobName VARCHAR(10) NOT NULL,
partId int NOT NULL,
userId int NOT NULL,
qty int NOT NULL,
PRIMARY KEY (jobName, partId, userId),
FOREIGN KEY(jobName) REFERENCES jobs(jobName),
FOREIGN KEY(partId) REFERENCES parts(partId));

INSERT INTO cloud.partOrdersX VALUES ('job1', 1, '101', 1);
INSERT INTO cloud.partOrdersX VALUES ('job2', 2, '102', 2);
INSERT INTO cloud.partOrdersX VALUES ('job3', 3, '103', 3);

select * from cloud.partOrdersX;