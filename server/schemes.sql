CREATE TABLE `pages` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `title`       varchar(64)     NOT NULL                                COMMENT '页面标题',
  `config`      varchar(512)    NOT NULL        DEFAULT ''              COMMENT '页面配置信息',
  `items`       varchar(10240)  NOT NULL                                COMMENT '页面数据 json格式',
  `create_by`   int(11)         NOT NULL        DEFAULT 0               COMMENT 'user id',
  `is_delete`   tinyint(4)      NOT NULL        DEFAULT 0               COMMENT '删除标记',
  `publish_at`  timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最近更新时间',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '活动页面';

CREATE TABLE `changelog` (
  `id`          int(11)         NOT NULL        AUTO_INCREMENT          COMMENT 'physical primary key',
  `action`      tinyint(4)      NOT NULL        DEFAULT 0               COMMENT '操作类型',
  `page_id`     int(11)         NOT NULL                                COMMENT '页面id',
  `items`       varchar(10240)  NOT NULL                                COMMENT '页面数据 json',
  `create_by`   int(11)         NOT NULL        DEFAULT 0               COMMENT 'user id',
  `update_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最近更新时间',
  `create_at`   timestamp       NOT NULL        DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `ix_page_id_create_at`                    (`page_id`, `create_at` DESC),
  KEY `ix_create_at`                            (`create_at`),
  KEY `ix_update_at`                            (`update_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '操作日志';
