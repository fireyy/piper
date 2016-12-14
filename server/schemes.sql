CREATE TABLE `pages` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `path`        varchar(64)     NOT NULL                                COMMENT 'url path',
  `title`        varchar(64)     NOT NULL                               COMMENT 'page title',
  `comment`     varchar(128)    NOT NULL        DEFAULT ''              COMMENT 'comment',
  `items`       varchar(10240)  NOT NULL                                COMMENT 'json items',
  `create_by`   int(11)         NOT NULL                                COMMENT 'sso user_id',
  `is_delete`   tinyint(4)      NOT NULL        DEFAULT 0               COMMENT 'delete flag',
  `publish_at`  timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT 'published time',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'last updated time',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT 'created time',
  PRIMARY KEY (`id`),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'pages';
