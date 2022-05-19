CREATE TABLE `users` (
	`user_id` 	INT PRIMARY KEY AUTO_INCREMENT,
	`name` 	VARCHAR(50),
	`email` 	VARCHAR(30),
	`phone`    	VARCHAR(10),
	`role`    	VARCHAR(10)
);

CREATE TABLE `helper` (
`helper_id`		INT  PRIMARY KEY
);

CREATE TABLE `helped` (
`helped_id`		INT  PRIMARY KEY
);

CREATE TABLE `connections` (
`connections_id`	INT PRIMARY KEY AUTO_INCREMENT,
`starting_date` 	DATE,
`ending_date` 		DATE,
`status`  		VARCHAR(30),
`location_id` 		INT,
`helped_id`		INT,
`helper_id`		INT,
`completed`		INT
);

CREATE TABLE `locations` (
`location_id`		INT PRIMARY KEY AUTO_INCREMENT,
`helper_id` 		INT,
`address` 		VARCHAR(100),
`starting_date` 	DATE,
`ending_date` 		DATE,
`sleeping_capacity` 	INT,
`phone`  		VARCHAR(10),
`status` 		VARCHAR(20),
`latitude`			FLOAT,
`longitude`		FLOAT
);

ALTER TABLE helper  ADD FOREIGN KEY (helper_id) REFERENCES users(user_id);
ALTER TABLE helped ADD FOREIGN KEY (helped_id) REFERENCES users(user_id);
ALTER TABLE connections ADD FOREIGN KEY (helped_id) REFERENCES helped(helped_id);
ALTER TABLE locations      ADD FOREIGN KEY (helper_id) REFERENCES helper(helper_id);	
