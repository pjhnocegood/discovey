CREATE TABLE `survey` (
  `survey_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `avatar` varchar(255) NOT NULL,
  `compensation` int DEFAULT NULL,
  `max` int DEFAULT NULL,
  PRIMARY KEY (`survey_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `survey_answer` (
  `survey_answer_id` int NOT NULL AUTO_INCREMENT,
  `survey_id` int DEFAULT NULL,
  `survey_detail_id` int DEFAULT NULL,
  `avatar` varchar(255) NOT NULL,
  `answer` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`survey_answer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `survey_detail` (
  `survey_detail_id` int NOT NULL AUTO_INCREMENT,
  `survey_id` int DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`survey_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `token_transfer` (
  `token_transfer_id` int NOT NULL AUTO_INCREMENT,
  `ethereum_address` varchar(255) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `is_completed` tinyint DEFAULT '0',
  PRIMARY KEY (`token_transfer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

