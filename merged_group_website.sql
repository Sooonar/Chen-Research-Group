/* Generated merge: online users/site_settings + local application data. */

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for achievements
-- ----------------------------
DROP TABLE IF EXISTS `achievements`;
CREATE TABLE `achievements`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('PUBLICATION','PATENT','COPYRIGHT','AWARD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `reviewer_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `review_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `achievements_user_id_fkey`(`user_id` ASC) USING BTREE,
  INDEX `achievements_reviewer_id_fkey`(`reviewer_id` ASC) USING BTREE,
  CONSTRAINT `achievements_reviewer_id_fkey` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `achievements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of achievements
-- ----------------------------

-- ----------------------------
-- Table structure for algorithms
-- ----------------------------
DROP TABLE IF EXISTS `algorithms`;
CREATE TABLE `algorithms`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `use_cases` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `related_paper_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `readme_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of algorithms
-- ----------------------------

-- ----------------------------
-- Table structure for awards
-- ----------------------------
DROP TABLE IF EXISTS `awards`;
CREATE TABLE `awards`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `competition` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` enum('NATIONAL_FIRST','NATIONAL_SECOND','NATIONAL_THIRD','PROVINCIAL_FIRST','PROVINCIAL_SECOND','PROVINCIAL_THIRD','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `winners` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `image_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `review_status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'APPROVED',
  `submitted_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of awards
-- ----------------------------
INSERT INTO `awards` VALUES ('cmtcmcgu20000rsiwen6w4vq9', '建模大赛', '测试', 'OTHER', '张启航，启航', 2026, NULL, NULL, 'APPROVED', NULL, '2026-08-28 07:17:05.210', '2026-08-28 07:17:05.210');
INSERT INTO `awards` VALUES ('cmtcnvtn0002x04iwv6mazvwg', '中亚“一带一路”严寒多震山区公路高边坡智能监测与灾害预警', '土木工程学院', 'OTHER', '宋战平,赵亮,高永吉（外）,孙引浩（外）,程昀（学）,王彤（学）,范胜元（外）,吕鹏涛（外）,张玉伟,陈登峰,刘世鹏（学）', 2025, '数据导入审核状态：学校通过', NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.884', '2026-08-28 08:01:52.425');
INSERT INTO `awards` VALUES ('cmtcnvtpi004h04iwr84sk17p', '混凝土CT图像的细观破裂结构智能检测技术研究', '信息与控制工程学院', 'OTHER', '徐胜军,陈登峰,赵亮,李昌华,党发宁（外）', 2014, '数据导入审核状态：学校通过', NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.974', '2026-08-28 08:01:52.544');
INSERT INTO `awards` VALUES ('cmtcnvtpm004j04iw9wkx4x4w', '静电除尘器高压脉冲电源研究', '建筑设备科学与工程学院', 'OTHER', '陈登峰,肖海燕,赵亮,王育平（外）', 2014, '数据导入审核状态：学校通过', NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.978', '2026-08-28 08:01:52.548');

-- ----------------------------
-- Table structure for competitions
-- ----------------------------
DROP TABLE IF EXISTS `competitions`;
CREATE TABLE `competitions`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `organizer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `result` enum('WON','NOT_WON') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NOT_WON',
  `participants` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `award_level` enum('NATIONAL_FIRST','NATIONAL_SECOND','NATIONAL_THIRD','PROVINCIAL_FIRST','PROVINCIAL_SECOND','PROVINCIAL_THIRD','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `image_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `project_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `award_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `competitions_award_id_key`(`award_id` ASC) USING BTREE,
  INDEX `competitions_project_id_fkey`(`project_id` ASC) USING BTREE,
  CONSTRAINT `competitions_award_id_fkey` FOREIGN KEY (`award_id`) REFERENCES `awards` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `competitions_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of competitions
-- ----------------------------
INSERT INTO `competitions` VALUES ('cmtcmcgu90001rsiwd232ah2z', '建模大赛', '测试', 2026, 'WON', '张启航，启航', 'OTHER', NULL, NULL, NULL, 'cmtcmcgu20000rsiwen6w4vq9', '2026-08-28 07:17:05.217', '2026-08-28 07:17:05.217');
INSERT INTO `competitions` VALUES ('cmtcnvtn4002y04iw7chrvl4f', '中亚“一带一路”严寒多震山区公路高边坡智能监测与灾害预警', '土木工程学院', 2025, 'WON', '宋战平,赵亮,高永吉（外）,孙引浩（外）,程昀（学）,王彤（学）,范胜元（外）,吕鹏涛（外）,张玉伟,陈登峰,刘世鹏（学）', 'OTHER', '数据导入审核状态：学校通过', NULL, NULL, 'cmtcnvtn0002x04iwv6mazvwg', '2026-08-28 08:00:07.888', '2026-08-28 08:01:52.428');
INSERT INTO `competitions` VALUES ('cmtcnvtpk004i04iw78zampgw', '混凝土CT图像的细观破裂结构智能检测技术研究', '信息与控制工程学院', 2014, 'WON', '徐胜军,陈登峰,赵亮,李昌华,党发宁（外）', 'OTHER', '数据导入审核状态：学校通过', NULL, NULL, 'cmtcnvtpi004h04iwr84sk17p', '2026-08-28 08:00:07.976', '2026-08-28 08:01:52.545');
INSERT INTO `competitions` VALUES ('cmtcnvtpo004k04iwlce74k20', '静电除尘器高压脉冲电源研究', '建筑设备科学与工程学院', 2014, 'WON', '陈登峰,肖海燕,赵亮,王育平（外）', 'OTHER', '数据导入审核状态：学校通过', NULL, NULL, 'cmtcnvtpm004j04iw9wkx4x4w', '2026-08-28 08:00:07.980', '2026-08-28 08:01:52.550');

-- ----------------------------
-- Table structure for members
-- ----------------------------
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` enum('TEACHER','MASTER','ALUMNI') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade` int NULL DEFAULT NULL,
  `research_direction` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `avatar_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT 0,
  `is_graduated` tinyint(1) NOT NULL DEFAULT 0,
  `graduation_year` int NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `members_user_id_key`(`user_id` ASC) USING BTREE,
  CONSTRAINT `members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of members
INSERT INTO `members` VALUES ('cmtbtcejv0002a8iwrlwp6yza', 'cmpe6rozw00000kmj4hqns0g3', '启航', 'MASTER', 1, NULL, NULL, '3416172032@qq.com', NULL, 10, 0, NULL, '2026-08-27 17:45:13.387', '2026-08-27 17:45:13.387');
INSERT INTO `members` VALUES ('cmtcnvtgg000004iwr5m6mikl', NULL, '马麟', 'ALUMNI', NULL, '系统工程', '院系：信息与控制工程学院；专业：系统工程；学生类别：全日制学术学位硕士；学号：1408220697；手机：15529570288；入学日期：2014-09-16', NULL, NULL, 0, 1, 2017, '2026-08-28 08:00:07.648', '2026-08-28 08:01:52.125');
INSERT INTO `members` VALUES ('cmtcnvtgn000104iwy1hmg2u1', NULL, '薛启启', 'ALUMNI', NULL, '控制理论与控制工程', '院系：信息与控制工程学院；专业：控制理论与控制工程；学生类别：全日制学术学位硕士；学号：1508210685；手机：15802968763；入学日期：2015-09-14', NULL, NULL, 1, 1, 2018, '2026-08-28 08:00:07.655', '2026-08-28 08:01:52.131');
INSERT INTO `members` VALUES ('cmtcnvtgr000204iwfgn0ayri', NULL, '赵婷', 'ALUMNI', NULL, '★智能建筑', '院系：信息与控制工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：1508210716；手机：13572969824；入学日期：2015-09-14', NULL, NULL, 2, 1, 2018, '2026-08-28 08:00:07.659', '2026-08-28 08:01:52.135');
INSERT INTO `members` VALUES ('cmtcnvtgw000304iwcd2uq7wr', NULL, '姜翔', 'ALUMNI', NULL, '控制理论与控制工程', '院系：信息与控制工程学院；专业：控制理论与控制工程；学生类别：全日制学术学位硕士；学号：1608210674；手机：13488238098；入学日期：2016-09-10', NULL, NULL, 3, 1, 2019, '2026-08-28 08:00:07.664', '2026-08-28 08:01:52.139');
INSERT INTO `members` VALUES ('cmtcnvth2000404iwtcnna6yr', NULL, '周瑶', 'ALUMNI', NULL, '控制理论与控制工程', '院系：信息与控制工程学院；专业：控制理论与控制工程；学生类别：全日制学术学位硕士；学号：1608210675；手机：13474657484；入学日期：2016-09-10', NULL, NULL, 4, 1, 2019, '2026-08-28 08:00:07.670', '2026-08-28 08:01:52.143');
INSERT INTO `members` VALUES ('cmtcnvth6000504iw6x35ivcv', NULL, '王彦柱', 'ALUMNI', NULL, '控制工程', '院系：信息与控制工程学院；专业：控制工程；学生类别：全日制专业学位硕士；学号：1608811516；手机：13720417759；入学日期：2016-09-10', NULL, NULL, 5, 1, 2019, '2026-08-28 08:00:07.674', '2026-08-28 08:01:52.146');
INSERT INTO `members` VALUES ('cmtcnvth9000604iw714e0r74', NULL, '耿建勤', 'ALUMNI', NULL, '控制工程', '院系：信息与控制工程学院；专业：控制工程；学生类别：全日制专业学位硕士；学号：1708811787；手机：13468814545；论文题目：微型扑翼飞行器控制系统研究与设计；入学日期：2017-09-06', NULL, NULL, 6, 1, 2020, '2026-08-28 08:00:07.677', '2026-08-28 08:01:52.149');
INSERT INTO `members` VALUES ('cmtcnvthb000704iwqd09fbf8', NULL, '刘国', 'ALUMNI', NULL, '控制工程', '院系：信息与控制工程学院；专业：控制工程；学生类别：全日制专业学位硕士；学号：1708811788；手机：15291416580；论文题目：基于自适应随机共振的电解质离子微弱信号检测方法研究与电路设计；入学日期：2017-09-06', NULL, NULL, 7, 1, 2020, '2026-08-28 08:00:07.679', '2026-08-28 08:01:52.153');
INSERT INTO `members` VALUES ('cmtcnvthe000804iwt6g7nr7n', NULL, '张温', 'ALUMNI', NULL, '计算机技术', '院系：信息与控制工程学院；专业：计算机技术；学生类别：全日制专业学位硕士；学号：1708811798；手机：17703590382；论文题目：基于BIM的城市综合管廊轻量可视化运维管理系统研究；入学日期：2017-09-06', NULL, NULL, 8, 1, 2020, '2026-08-28 08:00:07.682', '2026-08-28 08:01:52.156');
INSERT INTO `members` VALUES ('cmtcnvthh000904iw06ypcdio', NULL, '陈鹏文', 'ALUMNI', NULL, '控制工程', '院系：信息与控制工程学院；专业：控制工程；学生类别：全日制专业学位硕士；学号：1808811433；手机：18392668579；论文题目：基于边缘设备的作业现场安全护具检测系统应用研究；入学日期：2018-09-06', NULL, NULL, 9, 1, 2021, '2026-08-28 08:00:07.685', '2026-08-28 08:01:52.159');
INSERT INTO `members` VALUES ('cmtcnvthj000a04iwwoh1qxs9', NULL, '王凯', 'ALUMNI', NULL, '控制工程', '院系：信息与控制工程学院；专业：控制工程；学生类别：全日制专业学位硕士；学号：1808811434；手机：13087545358；论文题目：多接入边缘计算中的任务卸载决策研究；入学日期：2018-09-06', NULL, NULL, 10, 1, 2021, '2026-08-28 08:00:07.687', '2026-08-28 08:01:52.161');
INSERT INTO `members` VALUES ('cmtcnvthl000b04iw9dbp1sd7', NULL, '王帅举', 'ALUMNI', NULL, '控制工程', '院系：信息与控制工程学院；专业：控制工程；学生类别：全日制专业学位硕士；学号：1808811435；手机：15038595134；论文题目：基于BIM的桥梁信息轻量可视化运维管理系统应用研究；入学日期：2018-09-06', NULL, NULL, 11, 1, 2021, '2026-08-28 08:00:07.689', '2026-08-28 08:01:52.164');
INSERT INTO `members` VALUES ('cmtcnvthm000c04iwhqa480wa', NULL, '任宇松', 'ALUMNI', NULL, '计算机技术', '院系：信息与控制工程学院；专业：计算机技术；学生类别：全日制专业学位硕士；学号：2108811636；手机：18292754311；论文题目：基于机器学习的网络流量异常检测方法研究与应用；入学日期：2021-09-06', NULL, NULL, 12, 1, 2024, '2026-08-28 08:00:07.690', '2026-08-28 08:01:52.166');
INSERT INTO `members` VALUES ('cmtcnvtho000d04iwazs6xqvm', NULL, '雷江浩', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2116212638；手机：19073126216；论文题目：城市地下排水管道缺陷智能检测方法研究；入学日期：2021-09-06', NULL, NULL, 13, 1, 2024, '2026-08-28 08:00:07.692', '2026-08-28 08:01:52.169');
INSERT INTO `members` VALUES ('cmtcnvthr000e04iwdpi9giyp', NULL, '程静', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2116212643；手机：19839928250；论文题目：隧道掌子面岩体结构图像语义分割与裂隙表征研究；入学日期：2021-09-06', NULL, NULL, 14, 1, 2024, '2026-08-28 08:00:07.695', '2026-08-28 08:01:52.172');
INSERT INTO `members` VALUES ('cmtcnvtht000f04iwwzyizux3', NULL, '杨小燕', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2116212647；手机：18729219792；论文题目：基于三维探地雷达的城市道路病害智能检测方法研究；入学日期：2021-09-06', NULL, NULL, 15, 1, 2024, '2026-08-28 08:00:07.697', '2026-08-28 08:01:52.175');
INSERT INTO `members` VALUES ('cmtcnvthv000g04iwgcqmh0ls', NULL, '张乐新', 'ALUMNI', NULL, '电子信息', '院系：信息与控制工程学院；专业：电子信息；学生类别：全日制专业学位硕士；学号：2208811821；手机：13283818499；论文题目：微气候视角下的公共建筑低碳节能设计优化方法研究；入学日期：2022-09-16', NULL, NULL, 16, 1, 2025, '2026-08-28 08:00:07.699', '2026-08-28 08:01:52.177');
INSERT INTO `members` VALUES ('cmtcnvthy000h04iwsszv8gp1', NULL, '赵航辉', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2216212639；手机：13309137390；论文题目：城镇排水管道内部缺陷深度辨识与评定方法研究；入学日期：2022-09-16', NULL, NULL, 17, 1, 2025, '2026-08-28 08:00:07.702', '2026-08-28 08:01:52.180');
INSERT INTO `members` VALUES ('cmtcnvti0000i04iwbixengvh', NULL, '何拓航', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2216212646；手机：13474682453；论文题目：路基病害雷达图像检测与多视图融合识别方法研究；入学日期：2022-09-16', NULL, NULL, 18, 1, 2025, '2026-08-28 08:00:07.704', '2026-08-28 08:01:52.183');
INSERT INTO `members` VALUES ('cmtcnvti2000j04iwhv9skoze', NULL, '刘茜茜', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2216212658；手机：19939336393；论文题目：光伏面板多源图像融合缺陷检测方法研究；入学日期：2022-09-16', NULL, NULL, 19, 1, 2025, '2026-08-28 08:00:07.706', '2026-08-28 08:01:52.187');
INSERT INTO `members` VALUES ('cmtcnvti4000k04iw33sli7hf', NULL, '沈一闯', 'ALUMNI', NULL, '电子信息', '院系：信息与控制工程学院；专业：电子信息；学生类别：全日制专业学位硕士；学号：2308811868；手机：19838002915；论文题目：数据驱动的供水管网泄漏图神经网络检测方法研究；入学日期：2023-09-17', NULL, NULL, 20, 1, 2026, '2026-08-28 08:00:07.708', '2026-08-28 08:01:52.190');
INSERT INTO `members` VALUES ('cmtcnvti6000l04iwhy3yf39y', NULL, '李慕清', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2316212727；手机：18033806019；论文题目：道路路基病害探地雷达智能检测与反演方法研究；入学日期：2023-09-17', NULL, NULL, 21, 1, 2026, '2026-08-28 08:00:07.710', '2026-08-28 08:01:52.194');
INSERT INTO `members` VALUES ('cmtcnvti8000m04iwzvh11tuv', 'cmpjrjjz600030km9x2ovykvw', '王泽鹏', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2316212734；手机：18291456076；论文题目：排水管道缺陷频域特征融合实例分割与视频检测方法研究；入学日期：2023-09-17', NULL, NULL, 22, 1, 2026, '2026-08-28 08:00:07.712', '2026-08-28 08:01:52.196');
INSERT INTO `members` VALUES ('cmtcnvtia000n04iwjlwgfh4i', 'cmpzc2o0v000v0ko1pnj56but', '张中霖', 'ALUMNI', NULL, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2316212739；手机：15309138738；论文题目：面向震后受损建筑辅助评估的实景建模与缺陷检测研究；入学日期：2023-09-17', NULL, NULL, 23, 1, 2026, '2026-08-28 08:00:07.714', '2026-08-28 08:01:52.199');
INSERT INTO `members` VALUES ('cmtcnvtid000o04iwpi7bygp9', NULL, '马源', 'MASTER', 3, '计算机技术', '院系：人工智能与机器人学院；专业：计算机技术；学生类别：全日制专业学位硕士；学号：2408811748；手机：13503909959；入学日期：2024-09-04', NULL, NULL, 24, 0, NULL, '2026-08-28 08:00:07.717', '2026-08-28 08:01:52.203');
INSERT INTO `members` VALUES ('cmtcnvtie000p04iw4pjod5qd', 'cmpjp92bs00000lngf7bwo0d9', '苏诺', 'MASTER', 3, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2416212740；手机：15291931565；入学日期：2024-09-04', NULL, NULL, 25, 0, NULL, '2026-08-28 08:00:07.718', '2026-08-28 08:01:52.208');
INSERT INTO `members` VALUES ('cmtcnvtig000q04iw4ojevs5z', NULL, '刘映君', 'MASTER', 3, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2416212758；手机：15291065154；入学日期：2024-09-04', NULL, NULL, 26, 0, NULL, '2026-08-28 08:00:07.720', '2026-08-28 08:01:52.211');
INSERT INTO `members` VALUES ('cmtcnvtij000r04iwvwys6a0s', 'cmpjqsp5s00010km9f60fd49t', '孙雅昕', 'MASTER', 3, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2416212763；手机：19141089603；入学日期：2024-09-04', NULL, NULL, 27, 0, NULL, '2026-08-28 08:00:07.723', '2026-08-28 08:01:52.215');
INSERT INTO `members` VALUES ('cmtcnvtik000s04iwjjuv361s', NULL, '李坤洋', 'MASTER', 3, '人工环境工程', '院系：建筑设备科学与工程学院；专业：人工环境工程；学生类别：全日制专业学位硕士；学号：2416812771；手机：15991433108；入学日期：2024-09-04', NULL, NULL, 28, 0, NULL, '2026-08-28 08:00:07.724', '2026-08-28 08:01:52.217');
INSERT INTO `members` VALUES ('cmtcnvtim000t04iwktlokjgb', NULL, '苏佳宾', 'MASTER', 2, '机械', '院系：机电工程学院；专业：机械；学生类别：全日制专业学位硕士；学号：2507811463；手机：15664202013；入学日期：2025-09-03', NULL, NULL, 29, 0, NULL, '2026-08-28 08:00:07.726', '2026-08-28 08:01:52.220');
INSERT INTO `members` VALUES ('cmtcnvtip000u04iwoiitp3rv', NULL, '付凯悦', 'MASTER', 2, '控制科学与工程', '院系：人工智能与机器人学院；专业：控制科学与工程；学生类别：全日制学术学位硕士；学号：2508211639；手机：18092707496；入学日期：2025-09-03', NULL, NULL, 30, 0, NULL, '2026-08-28 08:00:07.729', '2026-08-28 08:01:52.222');
INSERT INTO `members` VALUES ('cmtcnvtir000v04iwihiva797', 'cmpz40tay000r0ko16osgzm4z', '公文倩', 'MASTER', 2, '电子信息', '院系：人工智能与机器人学院；专业：电子信息；学生类别：全日制专业学位硕士；学号：2508811781；手机：18369531373；入学日期：2025-09-03', NULL, NULL, 31, 0, NULL, '2026-08-28 08:00:07.731', '2026-08-28 08:01:52.224');
INSERT INTO `members` VALUES ('cmtcnvtit000w04iwwt3wxhzf', 'cmpl637ee00060km9u1wxitwp', '彭腾', 'MASTER', 2, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2516212668；手机：18792349103；入学日期：2025-09-03', NULL, NULL, 32, 0, NULL, '2026-08-28 08:00:07.733', '2026-08-28 08:01:52.227');
INSERT INTO `members` VALUES ('cmtcnvtiw000x04iws638kvcn', 'cmpjr9fmk00020km9tffuvjhi', '王昕昊', 'MASTER', 2, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2516212669；手机：18537998801；入学日期：2025-09-03', NULL, NULL, 33, 0, NULL, '2026-08-28 08:00:07.736', '2026-08-28 08:01:52.230');
INSERT INTO `members` VALUES ('cmtcnvtix000y04iwkljwvl8y', 'cmpzaak26000t0ko1nkipag3p', '梁伟', 'MASTER', 2, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2516212695；手机：18165368337；入学日期：2025-09-03', NULL, NULL, 34, 0, NULL, '2026-08-28 08:00:07.737', '2026-08-28 08:01:52.232');
INSERT INTO `members` VALUES ('cmtcnvtiz000z04iwzpbpmonh', NULL, '文斌', 'MASTER', 1, '控制科学与工程', '院系：人工智能与机器人学院；专业：控制科学与工程；学生类别：全日制学术学位硕士；学号：2608211610；手机：18717598259；入学日期：2026-09-06', NULL, NULL, 35, 0, NULL, '2026-08-28 08:00:07.739', '2026-08-28 08:01:52.235');
INSERT INTO `members` VALUES ('cmtcnvtj1001004iw2dl3kg5g', 'cmpjws8sp00050km9k2bq4inu', '李孟颖', 'MASTER', 1, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2616212586；手机：18669366204；入学日期：2026-09-06', NULL, NULL, 36, 0, NULL, '2026-08-28 08:00:07.741', '2026-08-28 08:01:52.237');
INSERT INTO `members` VALUES ('cmtcnvtj3001104iwnv8joq3p', 'cmpjqsg6000000km9480edytu', '张嘉烨', 'MASTER', 1, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2616212592；手机：15592399399；入学日期：2026-09-06', NULL, NULL, 37, 0, NULL, '2026-08-28 08:00:07.743', '2026-08-28 08:01:52.240');
INSERT INTO `members` VALUES ('cmtcnvtj5001204iwsmshj8oa', NULL, '王泽宇', 'MASTER', 1, '★智能建筑', '院系：建筑设备科学与工程学院；专业：★智能建筑；学生类别：全日制学术学位硕士；学号：2616212599；手机：13629242900；入学日期：2026-09-06', NULL, NULL, 38, 0, NULL, '2026-08-28 08:00:07.745', '2026-08-28 08:01:52.243');


-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('GROUP','ACADEMIC','AWARD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GROUP',
  `cover_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `author_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------

-- ----------------------------
-- Table structure for operation_logs
-- ----------------------------
DROP TABLE IF EXISTS `operation_logs`;
CREATE TABLE `operation_logs`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ip` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `operation_logs_user_id_fkey`(`user_id` ASC) USING BTREE,
  CONSTRAINT `operation_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of operation_logs
-- ----------------------------

-- ----------------------------
-- Table structure for patents
-- ----------------------------
DROP TABLE IF EXISTS `patents`;
CREATE TABLE `patents`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patent_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patent_type` enum('INVENTION','UTILITY','DESIGN') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('APPLIED','AUTHORIZED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `application_date` datetime(3) NULL DEFAULT NULL,
  `authorization_date` datetime(3) NULL DEFAULT NULL,
  `inventors` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `review_status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'APPROVED',
  `submitted_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of patents
-- ----------------------------
INSERT INTO `patents` VALUES ('cmtcnvtni003504iw4ryrm8om', '一种基于LightGBM的网络入侵检测模型的训练方法', 'IMPORT-8129cd880667', 'INVENTION', 'APPLIED', '2023-12-15 00:00:00.000', NULL, '杨小燕（学）,陈登峰,任宇松（学）,张乐新（学）,沈一闯（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.902', '2026-08-28 08:01:52.450');
INSERT INTO `patents` VALUES ('cmtcnvtnk003604iwlkhzpod3', '一种基于LightGBM的网络入侵检测模型的训练方法', 'IMPORT-4c029a10ba50', 'INVENTION', 'APPLIED', '2023-12-15 00:00:00.000', NULL, '陈登峰,任宇松（学）,张乐新（学）,沈一闯（学）,杨小燕（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.904', '2026-08-28 08:01:52.452');
INSERT INTO `patents` VALUES ('cmtcnvtnl003704iwyzawlqdm', '一种工业物联网网关流量子序列分类方法及系统', 'IMPORT-0edee04bbdbb', 'INVENTION', 'APPLIED', '2024-05-30 00:00:00.000', NULL, '赵亮,葛宝航（学）,陈登峰,雷东锋（学）,王宽（学）,沈一闯（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.905', '2026-08-28 08:01:52.454');
INSERT INTO `patents` VALUES ('cmtcnvtnm003804iwycm66qs1', '一种基于LORA与DTU的可靠通信系统及传输方法', 'IMPORT-a4bc1ff6e23d', 'INVENTION', 'APPLIED', '2024-05-30 00:00:00.000', NULL, '赵亮,葛宝航（学）,陈登峰,雷东锋（学）,王宽（学）,沈一闯（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.906', '2026-08-28 08:01:52.457');
INSERT INTO `patents` VALUES ('cmtcnvtno003904iwvghbmr5x', '一种隧道施工塌方风险评估方法、系统、设备及存储介质', 'IMPORT-d7e3cc800c5d', 'INVENTION', 'APPLIED', '2024-03-25 00:00:00.000', NULL, '赵亮,苏元琛（学）,陈登峰,宋战平,徐甜（学）,张玉伟', 'APPROVED', NULL, '2026-08-28 08:00:07.908', '2026-08-28 08:01:52.459');
INSERT INTO `patents` VALUES ('cmtcnvtnp003a04iw5b3f8sm4', '一种隧道衬砌缺陷雷达辨识与衬砌质量评价方法、系统、设备及存储介质', 'IMPORT-00410f9f3ff0', 'INVENTION', 'APPLIED', '2024-03-25 00:00:00.000', NULL, '赵亮,苏元琛（学）,刘世鹏（学）,宋战平,陈登峰,徐秋豪（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.909', '2026-08-28 08:01:52.460');
INSERT INTO `patents` VALUES ('cmtcnvtnr003b04iwjrelgc5d', '一种基于BIM的桥梁信息检测与可视化系统的构建方法', 'IMPORT-acfbe43fcef1', 'INVENTION', 'APPLIED', '2021-01-05 00:00:00.000', NULL, '陈登峰,王帅举（学）,陈鹏文（学）,张温（学）,肖海燕,杨小燕（学）,陈俊彤（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.911', '2026-08-28 08:01:52.463');
INSERT INTO `patents` VALUES ('cmtcnvtnz003g04iwf3wljytn', '一种混凝土整平装置用整平效果测量方法、系统及装置', 'IMPORT-cd4fbd570ff8', 'INVENTION', 'APPLIED', '2021-05-28 00:00:00.000', NULL, '陈登峰,王凯（学）,于军琪,肖海燕,陈俊彤（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.919', '2026-08-28 08:01:52.472');
INSERT INTO `patents` VALUES ('cmtcnvto0003h04iwreicoobp', '一种翼型无人机及其飞行控制方法', 'IMPORT-c858791b4c1b', 'INVENTION', 'APPLIED', '2019-04-29 00:00:00.000', NULL, '陈登峰,耿建勤（学）,陈鹏文（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.920', '2026-08-28 08:01:52.473');
INSERT INTO `patents` VALUES ('cmtcnvto1003i04iwhgegv1rx', '一种可堆叠的单元式自动化储物柜', 'IMPORT-15508c130228', 'INVENTION', 'APPLIED', '2020-01-17 00:00:00.000', NULL, '陈登峰,龙智勇（外）', 'APPROVED', NULL, '2026-08-28 08:00:07.921', '2026-08-28 08:01:52.475');
INSERT INTO `patents` VALUES ('cmtcnvto2003j04iwr28rqzqo', '一种混凝土整平装置用整平效果测量方法、系统及装置', 'IMPORT-7ab44a0342d9', 'INVENTION', 'APPLIED', '2021-05-28 00:00:00.000', NULL, '陈登峰,王凯（学）,肖海燕,陈俊彤（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.922', '2026-08-28 08:01:52.479');
INSERT INTO `patents` VALUES ('cmtcnvto8003m04iwamryvvzi', '一种基于面向对象的三维场景视锥体剔除方法', 'IMPORT-e3b74abe484e', 'INVENTION', 'APPLIED', '2019-10-25 00:00:00.000', NULL, '陈登峰,张温（学）,王帅举（学）,耿建勤（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.928', '2026-08-28 08:01:52.486');
INSERT INTO `patents` VALUES ('cmtcnvtob003n04iw2rirgi9e', '基于Hadoop和Docker的环境系统的部署方法', 'IMPORT-6928b3543bc9', 'INVENTION', 'APPLIED', '2021-01-26 00:00:00.000', NULL, '陈登峰,王凯（学）,肖海燕,陈俊彤（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.931', '2026-08-28 08:01:52.487');
INSERT INTO `patents` VALUES ('cmtcnvtoe003p04iw9r03t7hk', '一种用于仿昆虫式扑翼无人机的控制电路', 'IMPORT-0e0ea362d51b', 'INVENTION', 'APPLIED', '2019-04-29 00:00:00.000', NULL, '陈登峰,陈鹏文（学）,王凯（学）,肖海燕,耿建勤（学）,王帅举（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.934', '2026-08-28 08:01:52.491');
INSERT INTO `patents` VALUES ('cmtcnvtog003q04iwz5ztn0n6', '一种基于Three.js的室内布景渲染方法及系统', 'IMPORT-0cc12ea3eb3d', 'INVENTION', 'APPLIED', '2019-08-12 00:00:00.000', NULL, '陈登峰,张温（学）,王帅举（学）,耿建勤（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.936', '2026-08-28 08:01:52.493');
INSERT INTO `patents` VALUES ('cmtcnvtoi003r04iwz8ykbf81', '一种人脸检测模型训练方法及人脸识别方法、终端及存储介质', 'IMPORT-912ead08f021', 'INVENTION', 'APPLIED', '2021-05-28 00:00:00.000', NULL, '陈登峰,陈鹏文（学）,肖海燕,陈俊彤（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.938', '2026-08-28 08:01:52.495');
INSERT INTO `patents` VALUES ('cmtcnvtoj003s04iwkzh86xtj', '一种多类型多通道数据采集传输装置', 'IMPORT-c8bdeb8738eb', 'INVENTION', 'APPLIED', '2022-01-20 00:00:00.000', NULL, '赵亮,陈登峰,魏宁科（学）,徐凯（学）,雷东锋（学）,葛宝航（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.939', '2026-08-28 08:01:52.496');
INSERT INTO `patents` VALUES ('cmtcnvtok003t04iw7s5vutkx', '一种三维立体衣服模型的建立方法', 'IMPORT-7e6bcc262392', 'INVENTION', 'APPLIED', '2018-07-23 00:00:00.000', NULL, '陈登峰,王彦柱（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.940', '2026-08-28 08:01:52.498');
INSERT INTO `patents` VALUES ('cmtcnvtoo003w04iwbgjfqxx3', '一种基于扫描设备的二维码管理系统', 'IMPORT-cab1f4b2294a', 'INVENTION', 'APPLIED', '2016-12-29 00:00:00.000', NULL, '陈登峰,王彦柱（外）', 'APPROVED', NULL, '2026-08-28 08:00:07.944', '2026-08-28 08:01:52.503');
INSERT INTO `patents` VALUES ('cmtcnvtoz004404iw8dgllmce', '一种三维多角度试衣装置及试衣方法', 'IMPORT-ce82668e5e2d', 'INVENTION', 'APPLIED', '2018-07-23 00:00:00.000', NULL, '陈登峰,王彦柱（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.955', '2026-08-28 08:01:52.519');
INSERT INTO `patents` VALUES ('cmtcnvtp1004504iw5i44ep46', '一种便携式气体烟度检测装置', 'IMPORT-0de8c076dcac', 'INVENTION', 'APPLIED', '2020-10-27 00:00:00.000', NULL, '陈登峰,王帅举（学）,陈鹏文（学）,吉洪泽,董俊刚,陈俊彤（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.957', '2026-08-28 08:01:52.520');
INSERT INTO `patents` VALUES ('cmtcnvtp2004604iwpthru53r', '一种呼吸式智能玻璃幕墙', 'IMPORT-c9d3fbc29205', 'INVENTION', 'APPLIED', '2020-09-09 00:00:00.000', NULL, '赵南淇（学）,肖海燕,陈章政,陈登峰,王帅举（学）,陈鹏文（学）,张宪（学）,张雨', 'APPROVED', NULL, '2026-08-28 08:00:07.958', '2026-08-28 08:01:52.523');
INSERT INTO `patents` VALUES ('cmtcnvtp4004704iw2j7zkuuy', '一种基于Three.js的砼整平效果建模方法', 'IMPORT-45eec31436d6', 'INVENTION', 'APPLIED', '2021-05-26 00:00:00.000', NULL, '陈登峰,王凯（学）,肖海燕,陈俊彤（学）', 'PENDING', NULL, '2026-08-28 08:00:07.960', '2026-08-28 08:01:52.525');
INSERT INTO `patents` VALUES ('cmtcnvtp6004804iw7awxdv4x', '一种基于BIM的桩基工程数模可视化方法', 'IMPORT-3f6b9cdcfa38', 'INVENTION', 'APPLIED', '2021-05-16 00:00:00.000', NULL, '肖海燕,陈登峰,王帅举（学）,张温（学）,陈俊彤（学）,高升伦（学）', 'PENDING', NULL, '2026-08-28 08:00:07.962', '2026-08-28 08:01:52.527');
INSERT INTO `patents` VALUES ('cmtcnvtp7004904iw2zr2ig6c', '一种兼具新风与净化功能的绿植墙系统', 'IMPORT-62ba9b6a9f66', 'INVENTION', 'APPLIED', '2019-05-28 00:00:00.000', NULL, '陈登峰,董俊刚,张温（学）,王凯（学）,耿建勤（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.963', '2026-08-28 08:01:52.529');
INSERT INTO `patents` VALUES ('cmtcnvtp9004a04iwu3wk3rnw', '一种手套式虚拟输入装置与接收系统的输入与接收方法', 'IMPORT-3b51f211d4b2', 'INVENTION', 'APPLIED', '2017-09-08 00:00:00.000', NULL, '陈登峰,王彦柱（外）,姜翔（外）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.965', '2026-08-28 08:01:52.532');
INSERT INTO `patents` VALUES ('cmtcnvtpa004b04iwl9i9eug8', '储物柜', 'IMPORT-0fe3b7f21ecf', 'INVENTION', 'APPLIED', '2020-01-17 00:00:00.000', NULL, '陈登峰,张越然（外）,范晓琨（外）,薛若含（外）,林乐易（外）,张文轩（外）,章博峰（外）,任昊（外）,向烨坤（外）,王帅举（外）,龙智勇（外）', 'APPROVED', NULL, '2026-08-28 08:00:07.966', '2026-08-28 08:01:52.534');
INSERT INTO `patents` VALUES ('cmtcnvtph004g04iwfjgfr1cp', '一种单元式储物柜', 'IMPORT-e02a162f396f', 'INVENTION', 'APPLIED', '2020-01-17 00:00:00.000', NULL, '陈登峰,龙智勇（学）,张文轩（学）,章博峰（学）,范晓琨（学）,林乐易（学）,王帅举（学）,任昊（学）,向烨坤（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.973', '2026-08-28 08:01:52.542');
INSERT INTO `patents` VALUES ('cmtcnvtpq004l04iwa6u79gzy', '一种可堆叠的单元式自动化储物柜', 'IMPORT-9fd68b05b021', 'INVENTION', 'APPLIED', '2020-01-17 00:00:00.000', NULL, '陈登峰,龙智勇（外）,薛若含（外）,范晓琨（外）,张越然（外）,向烨坤（外）,林乐易（外）,唐珂欣（外）,胡蕴文（外）', 'APPROVED', NULL, '2026-08-28 08:00:07.982', '2026-08-28 08:01:52.552');
INSERT INTO `patents` VALUES ('cmtcnvtps004m04iwdlielfmz', '口罩佩戴实时检测的神经网络模型的搭建方法及实施系统', 'IMPORT-b8b02fe5393a', 'INVENTION', 'APPLIED', '2020-07-21 00:00:00.000', NULL, '陈章政,李明海,刘磊（学）,肖海燕,陈登峰,陈鹏文（学）,王帅举（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.984', '2026-08-28 08:01:52.554');
INSERT INTO `patents` VALUES ('cmtcnvtpu004n04iwbms4ee0k', '一种投币式自助广告投放装置', 'IMPORT-767a6ef3d8bb', 'INVENTION', 'APPLIED', '2019-09-12 00:00:00.000', NULL, '陈登峰,张温（学）,王帅举（学）,耿建勤（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.986', '2026-08-28 08:01:52.556');
INSERT INTO `patents` VALUES ('cmtcnvtpy004q04iwsawikfto', '一种仿昆虫式翼型无人机', 'IMPORT-c1db27b80d68', 'INVENTION', 'APPLIED', '2019-04-29 00:00:00.000', NULL, '陈登峰,耿建勤（学）,张温（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.990', '2026-08-28 08:01:52.561');
INSERT INTO `patents` VALUES ('cmtcnvtq0004r04iwdnscgr63', '一种自助广告投放装置及投放方法', 'IMPORT-90520a25b07f', 'INVENTION', 'APPLIED', '2019-09-12 00:00:00.000', NULL, '陈登峰,耿建勤（学）,王帅举（学）,张温（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:07.992', '2026-08-28 08:01:52.562');
INSERT INTO `patents` VALUES ('cmtcnvtq2004s04iwvcqucz0h', '一种用于电解质离子微弱电流信号检测的电路', 'IMPORT-221ce2f548ab', 'INVENTION', 'APPLIED', '2019-12-05 00:00:00.000', NULL, '陈登峰,刘国（学）,耿建勤（学）,张温（学）', 'PENDING', NULL, '2026-08-28 08:00:07.994', '2026-08-28 08:01:52.564');
INSERT INTO `patents` VALUES ('cmtcnvtq4004t04iwf8n0j1nd', '一种用于电解质离子微弱电流信号检测的电路结构及方法', 'IMPORT-1395d90d249f', 'INVENTION', 'APPLIED', '2019-12-05 00:00:00.000', NULL, '陈登峰,刘国（学）,耿建勤（学）,张温（学）', 'PENDING', NULL, '2026-08-28 08:00:07.996', '2026-08-28 08:01:52.565');
INSERT INTO `patents` VALUES ('cmtcnvtq5004u04iwgckevmxb', '一种生产中空中滑行折叠旋转夹持机械臂机构', 'IMPORT-61504310b4d1', 'INVENTION', 'APPLIED', '2019-11-20 00:00:00.000', NULL, '康智强,郑建校,陈登峰,高贝特（学）,田永堂（学）', 'APPROVED', NULL, '2026-08-28 08:00:07.997', '2026-08-28 08:01:52.566');
INSERT INTO `patents` VALUES ('cmtcnvtq9004x04iwmdnynlua', '一种多功能智能窗', 'IMPORT-1c6133856f06', 'INVENTION', 'APPLIED', '2017-12-29 00:00:00.000', NULL, '陈登峰,刘国（学）,耿建勤（学）,薛启启（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.001', '2026-08-28 08:01:52.572');
INSERT INTO `patents` VALUES ('cmtcnvtqt005b04iwas307gse', '一种智能绿植净化系统', 'IMPORT-1db0deb9bb62', 'INVENTION', 'APPLIED', '2018-06-04 00:00:00.000', NULL, '陈登峰,薛启启（学）,刘佳来（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.021', '2026-08-28 08:01:52.596');
INSERT INTO `patents` VALUES ('cmtcnvtqv005c04iw6eawxo95', '一种用于建筑环境综合监测的远程智能监测装置', 'IMPORT-3c84985f90cb', 'INVENTION', 'APPLIED', '2018-04-23 00:00:00.000', NULL, '陈登峰,耿建勤（学）,刘佳来（学）,刘国（学）,张温（学）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.023', '2026-08-28 08:01:52.597');
INSERT INTO `patents` VALUES ('cmtcnvtqz005f04iwi5rgnkyd', '一种基于光影非接触式多角度输入设备及输入方法', 'IMPORT-65cef34ba999', 'INVENTION', 'APPLIED', '2017-09-15 00:00:00.000', NULL, '陈登峰,王彦柱（外）,李楚君（外）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.027', '2026-08-28 08:01:52.602');
INSERT INTO `patents` VALUES ('cmtcnvtr3005i04iw6wo5lny6', '高压脉冲电源控制器', 'IMPORT-792da9e73628', 'INVENTION', 'APPLIED', '2012-01-18 00:00:00.000', NULL, '陈登峰,肖海燕,王宏波（外）,赵亮', 'APPROVED', NULL, '2026-08-28 08:00:08.031', '2026-08-28 08:01:52.610');
INSERT INTO `patents` VALUES ('cmtcnvtr4005j04iwcyike8ul', '一种便携式在线霍尔磁场连续测量仪', 'IMPORT-32c8aaaf19ae', 'INVENTION', 'APPLIED', '2016-04-28 00:00:00.000', NULL, '陈登峰,薛启启（外）,吴永江（外）,张金涛（外）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.032', '2026-08-28 08:01:52.612');
INSERT INTO `patents` VALUES ('cmtcnvtr5005k04iw6c6oqvty', '一种可穿戴生命体征监测手套', 'IMPORT-2a0cace14f9a', 'INVENTION', 'APPLIED', '2016-06-12 00:00:00.000', NULL, '陈登峰,薛启启（外）,吴永江（外）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.033', '2026-08-28 08:01:52.615');
INSERT INTO `patents` VALUES ('cmtcnvtr7005l04iwkfuuae0w', '一种基于SOC芯片的安全型视频监控系统及监控方法', 'IMPORT-75541ee70563', 'INVENTION', 'APPLIED', '2016-07-18 00:00:00.000', NULL, '陈登峰,薛启启（外）,肖海燕,吴永江（外）', 'APPROVED', NULL, '2026-08-28 08:00:08.035', '2026-08-28 08:01:52.617');
INSERT INTO `patents` VALUES ('cmtcnvtr8005m04iwysukkytw', '一种基于SOC芯片的安全型视频监控设备及监控方法', 'IMPORT-0d05d0103494', 'INVENTION', 'APPLIED', '2016-07-18 00:00:00.000', NULL, '陈登峰,薛启启（外）,吴永江（外）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.036', '2026-08-28 08:01:52.619');
INSERT INTO `patents` VALUES ('cmtcnvtr9005n04iwul99jdu1', '一种智能眼镜', 'IMPORT-ca6690bb0e9e', 'INVENTION', 'APPLIED', '2016-10-10 00:00:00.000', NULL, '陈登峰,薛启启（外）,赵婷（外）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.037', '2026-08-28 08:01:52.620');
INSERT INTO `patents` VALUES ('cmtcnvtrb005o04iw6bqqoi91', '一种智能便携式多功能插座', 'IMPORT-618eabf1df80', 'INVENTION', 'APPLIED', '2017-03-28 00:00:00.000', NULL, '王彦柱（外）,陈登峰,肖海燕', 'APPROVED', 'cmtcnvth6000504iw6x35ivcv', '2026-08-28 08:00:08.039', '2026-08-28 08:01:52.623');
INSERT INTO `patents` VALUES ('cmtcnvtre005p04iwjuzh5wcy', '一种便携式智能检测耳机', 'IMPORT-47be4e130067', 'INVENTION', 'APPLIED', '2017-03-31 00:00:00.000', NULL, '陈登峰,王彦柱（外）,姜翔（外）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.042', '2026-08-28 08:01:52.625');
INSERT INTO `patents` VALUES ('cmtcnvtrf005q04iw96cmcu0k', '一种基于绿植墙的空气净化系统', 'IMPORT-21c2a6acdf24', 'INVENTION', 'APPLIED', '2017-05-09 00:00:00.000', NULL, '陈登峰,薛启启（外）,肖海燕', 'APPROVED', NULL, '2026-08-28 08:00:08.043', '2026-08-28 08:01:52.627');
INSERT INTO `patents` VALUES ('cmtcnvtrg005r04iw1nzakyuo', '混凝土CT图像三维重构方法', 'IMPORT-d2dcc75ad630', 'INVENTION', 'APPLIED', '2012-01-18 00:00:00.000', NULL, '王宏波（外）,赵亮,李昌华,党发宁（外）,陈登峰,徐胜军', 'APPROVED', NULL, '2026-08-28 08:00:08.044', '2026-08-28 08:01:52.628');

-- ----------------------------
-- Table structure for project_awards
-- ----------------------------
DROP TABLE IF EXISTS `project_awards`;
CREATE TABLE `project_awards`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `award_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `project_awards_project_id_award_id_key`(`project_id` ASC, `award_id` ASC) USING BTREE,
  INDEX `project_awards_award_id_fkey`(`award_id` ASC) USING BTREE,
  CONSTRAINT `project_awards_award_id_fkey` FOREIGN KEY (`award_id`) REFERENCES `awards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_awards_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_awards
-- ----------------------------

-- ----------------------------
-- Table structure for project_copyrights
-- ----------------------------
DROP TABLE IF EXISTS `project_copyrights`;
CREATE TABLE `project_copyrights`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `copyright_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `project_copyrights_project_id_copyright_id_key`(`project_id` ASC, `copyright_id` ASC) USING BTREE,
  INDEX `project_copyrights_copyright_id_fkey`(`copyright_id` ASC) USING BTREE,
  CONSTRAINT `project_copyrights_copyright_id_fkey` FOREIGN KEY (`copyright_id`) REFERENCES `software_copyrights` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_copyrights_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_copyrights
-- ----------------------------

-- ----------------------------
-- Table structure for project_members
-- ----------------------------
DROP TABLE IF EXISTS `project_members`;
CREATE TABLE `project_members`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `project_members_project_id_member_id_key`(`project_id` ASC, `member_id` ASC) USING BTREE,
  INDEX `project_members_member_id_fkey`(`member_id` ASC) USING BTREE,
  CONSTRAINT `project_members_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_members_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_members
-- ----------------------------

-- ----------------------------
-- Table structure for project_patents
-- ----------------------------
DROP TABLE IF EXISTS `project_patents`;
CREATE TABLE `project_patents`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patent_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `project_patents_project_id_patent_id_key`(`project_id` ASC, `patent_id` ASC) USING BTREE,
  INDEX `project_patents_patent_id_fkey`(`patent_id` ASC) USING BTREE,
  CONSTRAINT `project_patents_patent_id_fkey` FOREIGN KEY (`patent_id`) REFERENCES `patents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_patents_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_patents
-- ----------------------------

-- ----------------------------
-- Table structure for project_progress
-- ----------------------------
DROP TABLE IF EXISTS `project_progress`;
CREATE TABLE `project_progress`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress_date` datetime(3) NOT NULL,
  `attachments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `project_progress_project_id_fkey`(`project_id` ASC) USING BTREE,
  CONSTRAINT `project_progress_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_progress
-- ----------------------------

-- ----------------------------
-- Table structure for project_publications
-- ----------------------------
DROP TABLE IF EXISTS `project_publications`;
CREATE TABLE `project_publications`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `publication_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `project_publications_project_id_publication_id_key`(`project_id` ASC, `publication_id` ASC) USING BTREE,
  INDEX `project_publications_publication_id_fkey`(`publication_id` ASC) USING BTREE,
  CONSTRAINT `project_publications_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_publications_publication_id_fkey` FOREIGN KEY (`publication_id`) REFERENCES `publications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_publications
-- ----------------------------

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `leader` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `funding_source` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `funding_amount` double NULL DEFAULT NULL,
  `start_date` datetime(3) NULL DEFAULT NULL,
  `end_date` datetime(3) NULL DEFAULT NULL,
  `status` enum('COMPLETED','APPROVED','APPLIED','ONGOING','SUSPENDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'APPLIED',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO `projects` VALUES ('cmtbulr3u0003a8iwtre9driw', '测试项目', '测试人', '', NULL, NULL, NULL, 'APPLIED', '', '2026-08-27 18:20:29.178', '2026-08-28 08:01:52.100');
INSERT INTO `projects` VALUES ('cmtcnvtj9001304iwhneowkh6', '基于深度学习的桥面铺装隐性病害智能检测关键技术研究', '陈登峰', '纵向 / 高校院所科技人员服务企业项目', 3, '2023-07-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：高校院所科技人员服务企业项目；所属单位：建筑设备科学与工程学院；项目编号：Z20240012；已到金额：2 万元；批准经费：3 万元', '2026-08-28 08:00:07.749', '2026-08-28 08:01:52.247');
INSERT INTO `projects` VALUES ('cmtcnvtje001404iwcirba4w2', '宁夏渠系建筑物典型病害图谱数据库开发', '陈登峰', '横向 / 技术开发', 11.3, '2026-04-28 00:00:00.000', NULL, 'APPROVED', '项目性质：横向；项目分类：技术开发；所属单位：建筑设备科学与工程学院；项目编号：20260329；已到金额：3.39 万元；批准经费：11.3 万元', '2026-08-28 08:00:07.754', '2026-08-28 08:01:52.251');
INSERT INTO `projects` VALUES ('cmtcnvtji001504iwfj7w9mpk', '面向高热流密度的冷板结构优化设计与性能研究', '孙娜', '横向 / 技术开发', 51, '2026-03-01 00:00:00.000', NULL, 'APPROVED', '项目性质：横向；项目分类：技术开发；所属单位：建筑设备科学与工程学院；项目编号：20260149；已到金额：20 万元；批准经费：51 万元', '2026-08-28 08:00:07.758', '2026-08-28 08:01:52.255');
INSERT INTO `projects` VALUES ('cmtcnvtjl001604iwh5nv9i9i', '公共设施风、光、水融合发电技术研究与开发技术服务', '陈登峰', '横向 / 技术开发', 27.2, '2025-12-10 00:00:00.000', NULL, 'APPROVED', '项目性质：横向；项目分类：技术开发；所属单位：建筑设备科学与工程学院；已到金额：0 万元；批准经费：27.2 万元', '2026-08-28 08:00:07.761', '2026-08-28 08:01:52.257');
INSERT INTO `projects` VALUES ('cmtcnvtjo001704iwx8amjqrm', '陕西榆林能源集团横山煤电1000MW间冷机组冷端节能高压细水喷雾系统智能寻优软件开发', '朱旭东', '横向 / 技术开发', 7, '2025-10-20 00:00:00.000', NULL, 'APPROVED', '项目性质：横向；项目分类：技术开发；所属单位：信息与控制工程学院；项目编号：20250887；已到金额：4.2 万元；批准经费：7 万元', '2026-08-28 08:00:07.764', '2026-08-28 08:01:52.260');
INSERT INTO `projects` VALUES ('cmtcnvtjq001804iw5mbfvy9q', '一种仿昆虫式翼型无人机', '肖海燕', '横向 / 技术转让', 5, '2024-11-05 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术转让；所属单位：信息与控制工程学院；项目编号：20240692；已到金额：5 万元；批准经费：5 万元', '2026-08-28 08:00:07.766', '2026-08-28 08:01:52.266');
INSERT INTO `projects` VALUES ('cmtcnvtjr001904iwojh74nog', '一种用于仿昆虫式扑翼无人机的控制电路', '肖海燕', '横向 / 技术转让', 5, '2024-11-05 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术转让；所属单位：信息与控制工程学院；项目编号：20240693；已到金额：5 万元；批准经费：5 万元', '2026-08-28 08:00:07.767', '2026-08-28 08:01:52.269');
INSERT INTO `projects` VALUES ('cmtcnvtjt001a04iw5maiujvk', '基于无人设备感知的建筑风险动态监测系统', '赵亮', '纵向 / 科学家+工程师队伍建设项目', 15, '2024-10-22 00:00:00.000', NULL, 'APPROVED', '项目性质：纵向；项目分类：科学家+工程师队伍建设项目；所属单位：继续教育（职业技术）学院；项目编号：Z20240780；已到金额：10.5 万元；批准经费：15 万元', '2026-08-28 08:00:07.769', '2026-08-28 08:01:52.273');
INSERT INTO `projects` VALUES ('cmtcnvtjv001b04iw4qeqi8vs', 'PE管道压力智能监测系统效果测试', '陈登峰', '横向 / 技术服务', 9, '2024-06-06 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术服务；所属单位：建筑设备科学与工程学院；项目编号：20240611；已到金额：9 万元；批准经费：9 万元', '2026-08-28 08:00:07.771', '2026-08-28 08:01:52.276');
INSERT INTO `projects` VALUES ('cmtcnvtjw001c04iwqvc8lpbg', '燃气阀井泄露远程智能监控、阴极保护智能监控、杂散电流智能监控及排流效果测试', '陈登峰', '横向 / 技术服务', 15, '2023-12-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术服务；所属单位：建筑设备科学与工程学院；项目编号：20230782；已到金额：15 万元；批准经费：15 万元', '2026-08-28 08:00:07.772', '2026-08-28 08:01:52.279');
INSERT INTO `projects` VALUES ('cmtcnvtjy001d04iwbrlreyn5', '一种基于BIM的桥梁信息检测与可视化系统的构建方法', '陈登峰', '横向 / 技术转让', 3, '2024-05-20 00:00:00.000', NULL, 'APPLIED', '项目性质：横向；项目分类：技术转让；所属单位：建筑设备科学与工程学院；项目编号：20240296；已到金额：0 万元；批准经费：3 万元', '2026-08-28 08:00:07.774', '2026-08-28 08:01:52.284');
INSERT INTO `projects` VALUES ('cmtcnvtjz001e04iw5e6y9rvw', '城市道路路基病害快速检测方法研究', '陈登峰', '纵向 / 陕西省自然科学基础研究计划_一般项目_面上项目', 5, '2024-01-18 00:00:00.000', NULL, 'APPROVED', '项目性质：纵向；项目分类：陕西省自然科学基础研究计划_一般项目_面上项目；所属单位：建筑设备科学与工程学院；项目编号：Z20240366；已到金额：5 万元；批准经费：5 万元', '2026-08-28 08:00:07.775', '2026-08-28 08:01:52.288');
INSERT INTO `projects` VALUES ('cmtcnvtk2001f04iw84h4ioc9', '岩土工程智能监测云信息系统v1.0', '赵亮', '横向 / 技术转让', 2, '2022-07-05 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术转让；所属单位：信息与控制工程学院；项目编号：20230186；已到金额：2 万元；批准经费：2 万元', '2026-08-28 08:00:07.778', '2026-08-28 08:01:52.292');
INSERT INTO `projects` VALUES ('cmtcnvtk3001g04iw1mpuhxnt', '基于三维探地雷达的城市道路隐蔽性病害辨识研究', '陈登峰', '横向 / 技术开发', 3, '2023-03-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术开发；所属单位：建筑设备科学与工程学院；项目编号：20230178；已到金额：3 万元；批准经费：3 万元', '2026-08-28 08:00:07.779', '2026-08-28 08:01:52.294');
INSERT INTO `projects` VALUES ('cmtcnvtk5001h04iwnpfhn4fv', '一种用于建筑环境综合监测的远程智能监测装置', '陈登峰', '横向 / 技术转让', 1, '2022-06-15 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术转让；所属单位：建筑设备科学与工程学院；项目编号：20220525；已到金额：1 万元；批准经费：1 万元', '2026-08-28 08:00:07.781', '2026-08-28 08:01:52.297');
INSERT INTO `projects` VALUES ('cmtcnvtk7001i04iwjlt0nr9j', '一种智能眼镜', '陈登峰', '横向 / 技术转让', 1, '2022-06-15 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术转让；所属单位：建筑设备科学与工程学院；项目编号：20220526；已到金额：1 万元；批准经费：1 万元', '2026-08-28 08:00:07.783', '2026-08-28 08:01:52.299');
INSERT INTO `projects` VALUES ('cmtcnvtk9001j04iwvzgw4dl5', '砖瓦窑炉钙基低湿脱硫脱硝技术优化与工业示范', '杨康', '纵向 / 陕西省教育厅协同创新中心项目', 30, '2020-06-19 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：陕西省教育厅协同创新中心项目；所属单位：材料科学与工程学院；项目编号：Z20200172；已到金额：10 万元；批准经费：30 万元', '2026-08-28 08:00:07.785', '2026-08-28 08:01:52.302');
INSERT INTO `projects` VALUES ('cmtcnvtkb001k04iwd4rapa1z', '基于区块链与wed  3D的建筑设备信息管理关键技术研究', '陈登峰', '纵向 / 省部级重点实验室开放基金', 2, '2021-03-05 00:00:00.000', NULL, 'APPROVED', '项目性质：纵向；项目分类：省部级重点实验室开放基金；所属单位：建筑设备科学与工程学院；项目编号：Z20210138；已到金额：2 万元；批准经费：2 万元', '2026-08-28 08:00:07.787', '2026-08-28 08:01:52.305');
INSERT INTO `projects` VALUES ('cmtcnvtkd001l04iw60i4pn4d', '建陶窑炉钙基吸收剂低湿同时脱硫脱硝技术优化与核心装备研发', '杨康', '纵向 / 其他相关部门', 15, '2020-11-10 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：其他相关部门；所属单位：材料科学与工程学院；项目编号：Z20200424；已到金额：15 万元；批准经费：15 万元', '2026-08-28 08:00:07.789', '2026-08-28 08:01:52.307');
INSERT INTO `projects` VALUES ('cmtcnvtkf001m04iwjkzzgxbr', '面向企业的BIM轻量化关键技术研究', '陈登峰', '纵向 / 高校人才服务企业项目', 3, '2020-10-15 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：高校人才服务企业项目；所属单位：建筑设备科学与工程学院；项目编号：Z20200385；已到金额：3 万元；批准经费：3 万元', '2026-08-28 08:00:07.791', '2026-08-28 08:01:52.309');
INSERT INTO `projects` VALUES ('cmtcnvtkh001n04iw5f4x8qg1', '隧道施工岩体稳定状态智能评估方法研究', '陈登峰', '校级 / 前沿交叉领域培育专项', 2, '2023-12-12 00:00:00.000', NULL, 'APPROVED', '项目性质：校级；项目分类：前沿交叉领域培育专项；所属单位：建筑设备科学与工程学院；项目编号：X20230072；已到金额：0 万元；批准经费：2 万元', '2026-08-28 08:00:07.793', '2026-08-28 08:01:52.312');
INSERT INTO `projects` VALUES ('cmtcnvtki001o04iwqmbcqah6', '新基建背景下以IBA融合创新推进智慧城市建设研究', '陈章政', '纵向 / 陕西省软科学研究计划_一般项目', 3, '2021-04-13 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：陕西省软科学研究计划_一般项目；所属单位：中国城乡建设与文化传承研究院/陕西省新型城镇化和人居环境研究院；项目编号：Z20210109；已到金额：3 万元；批准经费：3 万元', '2026-08-28 08:00:07.794', '2026-08-28 08:01:52.315');
INSERT INTO `projects` VALUES ('cmtcnvtkj001p04iwevopd0xh', '基于系统图谱的流程工业生产系统运行健康状态分析方法研究', '孙锴', '纵向 / 国家自然科学基金青年科学基金项目', 21, '2017-08-16 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：国家自然科学基金青年科学基金项目；所属单位：机电工程学院；项目编号：51705393；已到金额：23.1 万元；批准经费：21 万元', '2026-08-28 08:00:07.795', '2026-08-28 08:01:52.317');
INSERT INTO `projects` VALUES ('cmtcnvtkm001q04iwzrjurk7b', '基于现场监测数据的隧道施工安全管理平台', '赵亮', '横向 / 技术开发', 2, '2022-11-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术开发；所属单位：信息与控制工程学院；项目编号：20230412；已到金额：2 万元；批准经费：2 万元', '2026-08-28 08:00:07.798', '2026-08-28 08:01:52.320');
INSERT INTO `projects` VALUES ('cmtcnvtko001r04iwbd5pdq4f', '幼儿园新风净化测试研究', '董俊刚', '横向 / 技术服务', 5, '2018-06-05 00:00:00.000', NULL, 'APPROVED', '项目性质：横向；项目分类：技术服务；所属单位：建筑学院；项目编号：20180252；已到金额：2 万元；批准经费：5 万元', '2026-08-28 08:00:07.800', '2026-08-28 08:01:52.323');
INSERT INTO `projects` VALUES ('cmtcnvtkp001s04iw71qpfbz9', '城市智能除霾系统评估测试研究', '董俊刚', '横向 / 技术服务', 1.5, '2018-03-26 00:00:00.000', NULL, 'APPROVED', '项目性质：横向；项目分类：技术服务；所属单位：建筑学院；项目编号：20180162；已到金额：0.5 万元；批准经费：1.5 万元', '2026-08-28 08:00:07.801', '2026-08-28 08:01:52.326');
INSERT INTO `projects` VALUES ('cmtcnvtkr001t04iw27zr57d8', '基于物联网的隧道衬砌结构病害智能检测系统研究', '赵亮', '纵向 / 陕西省教育厅服务地方专项科研计划项目', 10, '2022-08-10 00:00:00.000', NULL, 'APPROVED', '项目性质：纵向；项目分类：陕西省教育厅服务地方专项科研计划项目；所属单位：信息与控制工程学院；项目编号：Z20220471；已到金额：10 万元；批准经费：10 万元', '2026-08-28 08:00:07.803', '2026-08-28 08:01:52.329');
INSERT INTO `projects` VALUES ('cmtcnvtkt001u04iw1twxnejj', '施工现场智能化设备与机具研究', '于军琪', '横向 / 技术服务', 5, '2018-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术服务；所属单位：建筑设备科学与工程学院；项目编号：20190299；已到金额：4.5 万元；批准经费：5 万元', '2026-08-28 08:00:07.805', '2026-08-28 08:01:52.332');
INSERT INTO `projects` VALUES ('cmtcnvtkv001v04iwmp7xszso', '基于WebGL的装配式建筑运行监测与威胁评估关键技术研究', '陈登峰', '纵向 / 陕西省建设厅科技发展计划项目', 0, '2019-12-09 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：陕西省建设厅科技发展计划项目；所属单位：建筑设备科学与工程学院；项目编号：Z20190472；已到金额：0 万元；批准经费：0 万元', '2026-08-28 08:00:07.807', '2026-08-28 08:01:52.333');
INSERT INTO `projects` VALUES ('cmtcnvtkx001w04iwjk3ohux6', '基于无线网络技术的岩土工程检测大数据管理系统研发', '赵亮', '横向 / 技术开发', 5, '2020-11-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术开发；所属单位：信息与控制工程学院；项目编号：20210187；已到金额：5 万元；批准经费：5 万元', '2026-08-28 08:00:07.809', '2026-08-28 08:01:52.336');
INSERT INTO `projects` VALUES ('cmtcnvtkz001x04iw39ak5dlm', '\"物联网+\"在役建筑结构健康监测可视化平台研发', '陈登峰', '校级 / 校企联合基金', 2.5, '2022-04-01 00:00:00.000', NULL, 'APPROVED', '项目性质：校级；项目分类：校企联合基金；所属单位：建筑设备科学与工程学院；项目编号：XAJD-YF22N009；已到金额：2.5 万元；批准经费：2.5 万元', '2026-08-28 08:00:07.811', '2026-08-28 08:01:52.339');
INSERT INTO `projects` VALUES ('cmtcnvtl0001y04iwjqfs2bbk', '一种基于扫描设备的二维码管理系统', '陈登峰', '横向 / 技术转让', 1, '2018-05-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术转让；所属单位：建筑设备科学与工程学院；项目编号：20180222；已到金额：1 万元；批准经费：1 万元', '2026-08-28 08:00:07.812', '2026-08-28 08:01:52.341');
INSERT INTO `projects` VALUES ('cmtcnvtl2001z04iwe777pufq', '混凝土类细观结构破损过程变形场的三维数字图像散斑法研究', '赵亮', '纵向 / 陕西省自然科学基础研究计划_一般项目_面上项目', 3, '2019-05-16 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：陕西省自然科学基础研究计划_一般项目_面上项目；所属单位：信息与控制工程学院；项目编号：Z20190136；已到金额：3 万元；批准经费：3 万元', '2026-08-28 08:00:07.814', '2026-08-28 08:01:52.343');
INSERT INTO `projects` VALUES ('cmtcnvtl3002004iw22mma89f', '钢结构应力和损伤高压脉冲涡流磁性检测技术研究', '陈登峰', '纵向 / 住房和城乡建设部', 0, '2014-07-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：住房和城乡建设部；所属单位：建筑设备科学与工程学院；项目编号：2014-K2-025；已到金额：0 万元；批准经费：0 万元', '2026-08-28 08:00:07.815', '2026-08-28 08:01:52.346');
INSERT INTO `projects` VALUES ('cmtcnvtl6002104iwhd39virx', '互联网出口宽带信息化管理系统开发研究', '赵亮', '纵向 / 西安市工业应用技术研发项目（高校院所技术转移推进项目）', 5, '2017-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市工业应用技术研发项目（高校院所技术转移推进项目）；所属单位：信息与控制工程学院；项目编号：JZKD0011；已到金额：3.5 万元；批准经费：5 万元', '2026-08-28 08:00:07.818', '2026-08-28 08:01:52.348');
INSERT INTO `projects` VALUES ('cmtcnvtl9002204iw7jm6qx08', '“新基建”背景下智慧城市精细化管理研究', '陈登峰', '校级 / 年度项目', 1, '2020-04-27 00:00:00.000', NULL, 'APPROVED', '项目性质：校级；项目分类：年度项目；所属单位：建筑设备科学与工程学院；项目编号：CZ2003；已到金额：0 万元；批准经费：1 万元', '2026-08-28 08:00:07.821', '2026-08-28 08:01:52.350');
INSERT INTO `projects` VALUES ('cmtcnvtla002304iwzwmtgfew', '面向21世纪的榆林市化工企业信息化构建技术研究', '嵇启春', '纵向 / 榆林市科技计划项目', 5, '2009-09-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：榆林市科技计划项目；所属单位：信息与控制工程学院；项目编号：Sg09-1-08；已到金额：2.5 万元；批准经费：5 万元', '2026-08-28 08:00:07.822', '2026-08-28 08:01:52.353');
INSERT INTO `projects` VALUES ('cmtcnvtld002404iws3naoy1s', '磨矿工业过程数据采集与智能控制系统', '佟威', '纵向 / 西安市工业应用技术研发项目（高校院所技术转移推进项目）', 5, '2008-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市工业应用技术研发项目（高校院所技术转移推进项目）；所属单位：信息与控制工程学院；项目编号：CXY08013(1)；已到金额：3.5 万元；批准经费：5 万元', '2026-08-28 08:00:07.825', '2026-08-28 08:01:52.355');
INSERT INTO `projects` VALUES ('cmtcnvtlf002504iwficvyhcu', '钢包下渣检测系统', '嵇启春', '纵向 / 西安工业应用发展研究项目', 3, '2007-06-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安工业应用发展研究项目；所属单位：信息与控制工程学院；项目编号：YF07045；已到金额：2.1 万元；批准经费：3 万元', '2026-08-28 08:00:07.827', '2026-08-28 08:01:52.358');
INSERT INTO `projects` VALUES ('cmtcnvtlg002604iwmik7ttkr', '高比电阻尘粒强电场运动特性研究', '陈登峰', '纵向 / 陕西省教育厅专项科研项目', 2, '2014-07-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：陕西省教育厅专项科研项目；所属单位：建筑设备科学与工程学院；项目编号：14JK1408；已到金额：2 万元；批准经费：2 万元', '2026-08-28 08:00:07.828', '2026-08-28 08:01:52.361');
INSERT INTO `projects` VALUES ('cmtcnvtlm002704iwlogf4c00', '流动空间人工光环境优化与节能控制研究', '段中兴', '纵向 / 国家自然科学基金面上项目', 60, '2012-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：国家自然科学基金面上项目；所属单位：信息与控制工程学院；项目编号：51178373；已到金额：60 万元；批准经费：60 万元', '2026-08-28 08:00:07.834', '2026-08-28 08:01:52.363');
INSERT INTO `projects` VALUES ('cmtcnvtlo002804iwdy6u97sh', '钢结构应力集中三维在线监测系统研究', '陈登峰', '纵向 / 西安市碑林区科技局', 2, NULL, NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市碑林区科技局；所属单位：建筑设备科学与工程学院；项目编号：GX1501；已到金额：2 万元；批准经费：2 万元', '2026-08-28 08:00:07.836', '2026-08-28 08:01:52.365');
INSERT INTO `projects` VALUES ('cmtcnvtlq002904iw31yi86sm', '电子耳蜗中汉语语音降噪新技术研究', '卫铭斐', '横向 / 技术服务', 6.7, '2014-09-18 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术服务；所属单位：信息与控制工程学院；项目编号：2014342；已到金额：6.7 万元；批准经费：6.7 万元', '2026-08-28 08:00:07.838', '2026-08-28 08:01:52.369');
INSERT INTO `projects` VALUES ('cmtcnvtlu002a04iwev84oqui', '基于运行性能在线评估的炼焦生产过程运行优化控制策略研究', '王伟', '校级 / 人才科技基金', 5, '2011-10-01 00:00:00.000', NULL, 'APPROVED', '项目性质：校级；项目分类：人才科技基金；所属单位：信息与控制工程学院；项目编号：RC1111；已到金额：0 万元；批准经费：5 万元', '2026-08-28 08:00:07.842', '2026-08-28 08:01:52.371');
INSERT INTO `projects` VALUES ('cmtcnvtlv002b04iwq1av4gqh', '工地车辆智能管理系统', '嵇启春', '横向 / 技术服务', 29, '2008-03-31 00:00:00.000', NULL, 'COMPLETED', '项目性质：横向；项目分类：技术服务；所属单位：信息与控制工程学院；项目编号：2008084；已到金额：29 万元；批准经费：29 万元', '2026-08-28 08:00:07.843', '2026-08-28 08:01:52.373');
INSERT INTO `projects` VALUES ('cmtcnvtlx002c04iw2p9rog1n', '铁厂配料综合控制系统设计', '佟威', '横向 / 技术服务', 2.5, '2008-02-03 00:00:00.000', NULL, 'APPLIED', '项目性质：横向；项目分类：技术服务；所属单位：信息与控制工程学院；项目编号：2008041；已到金额：0 万元；批准经费：2.5 万元', '2026-08-28 08:00:07.845', '2026-08-28 08:01:52.375');
INSERT INTO `projects` VALUES ('cmtcnvtlz002d04iw73sxtj14', '舜达彩涂线电气系统设计与调试', '陈登峰', '横向 / 技术服务', 3, '2007-10-17 00:00:00.000', NULL, 'APPLIED', '项目性质：横向；项目分类：技术服务；所属单位：建筑设备科学与工程学院；项目编号：2007261；已到金额：1.2 万元；批准经费：3 万元', '2026-08-28 08:00:07.847', '2026-08-28 08:01:52.378');
INSERT INTO `projects` VALUES ('cmtcnvtm1002e04iwxwcwhkvm', '基于多传感器信息融合的室内空气舒适度检测算法研究', '陈登峰', '校级 / 青年科技基金', 0.3, '2005-07-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：校级；项目分类：青年科技基金；所属单位：建筑设备科学与工程学院；项目编号：QN0507；已到金额：0 万元；批准经费：0.3 万元', '2026-08-28 08:00:07.849', '2026-08-28 08:01:52.381');
INSERT INTO `projects` VALUES ('cmtcnvtm2002f04iwinylj212', '变风量中央空调系统的智能优化控制研究', '董丽丽', '纵向 / 西安市科技攻关计划项目', 3, '2005-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市科技攻关计划项目；所属单位：信息与控制工程学院；项目编号：GG05020；已到金额：0 万元；批准经费：3 万元', '2026-08-28 08:00:07.850', '2026-08-28 08:01:52.383');
INSERT INTO `projects` VALUES ('cmtcnvtm4002g04iwt0hlbmya', '基于大系统优化理论的变风量（VAV）中央空调系统节能控制技术研究', '任庆昌', '纵向 / 国家自然科学基金面上项目', 28, '2007-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：国家自然科学基金面上项目；所属单位：信息与控制工程学院；项目编号：50678145；已到金额：11.2 万元；批准经费：28 万元', '2026-08-28 08:00:07.852', '2026-08-28 08:01:52.385');
INSERT INTO `projects` VALUES ('cmtcnvtm7002h04iwag7c1g1p', '高层建筑健康检测关键技术与实现方法研究', '高军伟', '校级 / 人才科技基金', 5, '2015-07-01 00:00:00.000', NULL, 'APPROVED', '项目性质：校级；项目分类：人才科技基金；所属单位：信息与控制工程学院；项目编号：RC1524；已到金额：0 万元；批准经费：5 万元', '2026-08-28 08:00:07.855', '2026-08-28 08:01:52.388');
INSERT INTO `projects` VALUES ('cmtcnvtm9002i04iwjb6lw2mh', '钢结构应力损伤智能检测与模型重构技术研究', '陈登峰', '纵向 / 西安市城乡建设委员会建设科技项目', 2.5, '2014-07-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市城乡建设委员会建设科技项目；所属单位：建筑设备科学与工程学院；项目编号：SJW2014017；已到金额：2.5 万元；批准经费：2.5 万元', '2026-08-28 08:00:07.857', '2026-08-28 08:01:52.390');
INSERT INTO `projects` VALUES ('cmtcnvtmb002j04iwml8m0syk', '电除尘器多相流三维建模与流场特性研究', '陈登峰', '校级 / 基础研究基金', 0.8, '2013-07-01 00:00:00.000', NULL, 'APPROVED', '项目性质：校级；项目分类：基础研究基金；所属单位：建筑设备科学与工程学院；项目编号：JC1318；已到金额：0 万元；批准经费：0.8 万元', '2026-08-28 08:00:07.859', '2026-08-28 08:01:52.392');
INSERT INTO `projects` VALUES ('cmtcnvtmd002k04iwks8jr8lc', '混凝土细观破裂图像处理重建技术研究', '赵亮', '纵向 / 陕西省自然科学基础研究计划_一般项目_青年项目', 5, '2013-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：陕西省自然科学基础研究计划_一般项目_青年项目；所属单位：信息与控制工程学院；项目编号：2013JQ7024；已到金额：5 万元；批准经费：5 万元', '2026-08-28 08:00:07.861', '2026-08-28 08:01:52.395');
INSERT INTO `projects` VALUES ('cmtcnvtme002l04iwrc8v87pw', '混凝土图像处理技术研究', '赵亮', '校级 / 人才科技基金', 2, '2012-12-01 00:00:00.000', NULL, 'APPROVED', '项目性质：校级；项目分类：人才科技基金；所属单位：信息与控制工程学院；项目编号：RC1249；已到金额：0 万元；批准经费：2 万元', '2026-08-28 08:00:07.862', '2026-08-28 08:01:52.397');
INSERT INTO `projects` VALUES ('cmtcnvtmf002m04iwdiqp4cvz', '智能机器人目标搜索算法研究', '李兆强', '校级 / 人才科技基金', 5, '2013-01-01 00:00:00.000', NULL, 'APPROVED', '项目性质：校级；项目分类：人才科技基金；所属单位：信息与控制工程学院；项目编号：RC1244；已到金额：0 万元；批准经费：5 万元', '2026-08-28 08:00:07.863', '2026-08-28 08:01:52.399');
INSERT INTO `projects` VALUES ('cmtcnvtmh002n04iwav637tov', '基于多源信息的电除尘器脉冲供电节能技术研究', '陈登峰', '纵向 / 西安市碑林区科技局', 3, '2012-06-30 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市碑林区科技局；所属单位：建筑设备科学与工程学院；项目编号：GX1206；已到金额：3 万元；批准经费：3 万元', '2026-08-28 08:00:07.865', '2026-08-28 08:01:52.402');
INSERT INTO `projects` VALUES ('cmtcnvtmj002o04iwxky3zv2s', '混凝土CT图像细观结构破损智能检测系统研究', '赵亮', '纵向 / 西安市城乡建设委员会建设科技项目', 2, '2012-04-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市城乡建设委员会建设科技项目；所属单位：信息与控制工程学院；项目编号：SJW201223；已到金额：2 万元；批准经费：2 万元', '2026-08-28 08:00:07.867', '2026-08-28 08:01:52.403');
INSERT INTO `projects` VALUES ('cmtcnvtmk002p04iwr5kvwdfg', '融合形状特征和语义知识的三维模型检索方法研究', '陈俊英', '校级 / 青年科技基金', 0.5, '2011-07-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：校级；项目分类：青年科技基金；所属单位：信息与控制工程学院；项目编号：QN1124；已到金额：0 万元；批准经费：0.5 万元', '2026-08-28 08:00:07.868', '2026-08-28 08:01:52.406');
INSERT INTO `projects` VALUES ('cmtcnvtml002q04iwn2ej3de8', '榆林风能/太阳能发电量无线远程监控及能源管理系统研究', '于军琪', '纵向 / 榆林市科技计划项目', 5, '2011-06-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：榆林市科技计划项目；所属单位：建筑设备科学与工程学院；已到金额：5 万元；批准经费：5 万元', '2026-08-28 08:00:07.869', '2026-08-28 08:01:52.409');
INSERT INTO `projects` VALUES ('cmtcnvtmq002r04iwxef2x34s', '建筑混凝土结构缺陷CT智能检测系统研究', '赵亮', '纵向 / 西安市碑林区科技局', 3, '2011-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市碑林区科技局；所属单位：信息与控制工程学院；项目编号：GX1103；已到金额：3 万元；批准经费：3 万元', '2026-08-28 08:00:07.874', '2026-08-28 08:01:52.411');
INSERT INTO `projects` VALUES ('cmtcnvtms002s04iwsqtjlwzu', 'MEMS惯性测量组件的H次优滤波方法及技术', '宋丽君', '校级 / 人才科技基金', 5, '2011-04-06 00:00:00.000', NULL, 'COMPLETED', '项目性质：校级；项目分类：人才科技基金；所属单位：信息与控制工程学院；项目编号：RC1105；已到金额：0 万元；批准经费：5 万元', '2026-08-28 08:00:07.876', '2026-08-28 08:01:52.413');
INSERT INTO `projects` VALUES ('cmtcnvtmt002t04iwewhbmpbh', '高压脉冲供电电除尘技术研究应用', '陈登峰', '纵向 / 西安市工业应用技术研发项目（高校院所技术转移推进项目）', 5, '2010-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市工业应用技术研发项目（高校院所技术转移推进项目）；所属单位：建筑设备科学与工程学院；项目编号：CXY1018（1）；已到金额：5 万元；批准经费：5 万元', '2026-08-28 08:00:07.877', '2026-08-28 08:01:52.415');
INSERT INTO `projects` VALUES ('cmtcnvtmu002u04iwcwk6fumq', '混凝土CT图像结构缺陷智能检测技术研究', '赵亮', '纵向 / 西安市工业应用技术研发项目（高校院所技术转移推进项目）', 5, '2010-01-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市工业应用技术研发项目（高校院所技术转移推进项目）；所属单位：信息与控制工程学院；项目编号：CXY1014（3）；已到金额：5 万元；批准经费：5 万元', '2026-08-28 08:00:07.878', '2026-08-28 08:01:52.418');
INSERT INTO `projects` VALUES ('cmtcnvtmw002v04iwe7qq0pk4', '基于混凝土CT图像的智能处理研究', '赵亮', '校级 / 青年科技基金', 0.3, '2009-07-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：校级；项目分类：青年科技基金；所属单位：信息与控制工程学院；项目编号：QN0925；已到金额：0 万元；批准经费：0.3 万元', '2026-08-28 08:00:07.880', '2026-08-28 08:01:52.419');
INSERT INTO `projects` VALUES ('cmtcnvtmy002w04iwnxovcezf', '大型公共建筑节能实时监测及计算机管理系统研究', '于军琪', '纵向 / 西安市城乡建设委员会建设科技项目', 2, '2009-07-01 00:00:00.000', NULL, 'COMPLETED', '项目性质：纵向；项目分类：西安市城乡建设委员会建设科技项目；所属单位：建筑设备科学与工程学院；已到金额：2 万元；批准经费：2 万元', '2026-08-28 08:00:07.882', '2026-08-28 08:01:52.422');

-- ----------------------------
-- Table structure for publications
-- ----------------------------
DROP TABLE IF EXISTS `publications`;
CREATE TABLE `publications`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `authors` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `journal` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `doi` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `abstract` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'APPROVED',
  `submitted_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `publications_submitted_by_fkey`(`submitted_by` ASC) USING BTREE,
  CONSTRAINT `publications_submitted_by_fkey` FOREIGN KEY (`submitted_by`) REFERENCES `members` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of publications
-- ----------------------------
INSERT INTO `publications` VALUES ('cmtcnvtn7002z04iwv4v49r9w', '路基病害雷达图像多视图融合识别方法', '陈登峰,何拓航（学）,杨小燕（学）,刘世鹏（学）,孟屯良（外）', '建筑设备科学与工程学院', 2025, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.891', '2026-08-28 08:01:52.433');
INSERT INTO `publications` VALUES ('cmtcnvtn8003004iw9zo3966z', '改进U-Net模型的隧道掌子面图像语义分割研究', '程静（学）,赵蕾,何拓航（学）,陈登峰', '建筑设备科学与工程学院', 2025, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.892', '2026-08-28 08:01:52.435');
INSERT INTO `publications` VALUES ('cmtcnvtna003104iwp0vhebo7', '集成边缘门控与多尺度空间注意的排水管道缺陷分割模型', '陈登峰,赵航辉（学）,刘世鹏（学）,孟屯良（外）,王泽鹏（学）', '建筑设备科学与工程学院', 2025, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.894', '2026-08-28 08:01:52.437');
INSERT INTO `publications` VALUES ('cmtcnvtnt003d04iweqsklkfv', 'Research on Routing Algorithm of Construction Robot Cluster Enhanced Ad Hoc Network', '魏宁科（学）,赵亮,陈登峰', '信息与控制工程学院', 2023, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.913', '2026-08-28 08:01:52.466');
INSERT INTO `publications` VALUES ('cmtcnvtnu003e04iwhl7nriuh', 'Research on Fault Detection by Flow Sequence for Industrial Internet of Things in Sewage Treatment Plant Case', '雷东锋（学）,赵亮,陈登峰', '信息与控制工程学院', 2024, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.914', '2026-08-28 08:01:52.468');
INSERT INTO `publications` VALUES ('cmtcnvtnx003f04iw3xwmfg7n', '隧道施工中塌方风险耦合评估方法研究', '赵亮,苏元琛（学）,宋战平,徐甜（学）,陈登峰', '信息与控制工程学院', 2024, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.917', '2026-08-28 08:01:52.470');
INSERT INTO `publications` VALUES ('cmtcnvtol003u04iwgzttu8a8', 'Design and implementation of bridge information management system based on BIM', '陈登峰,王帅举（学）,张温（学）,杨亚龙（外）,陈鹏文（学）', '建筑设备科学与工程学院', 2022, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.941', '2026-08-28 08:01:52.500');
INSERT INTO `publications` VALUES ('cmtcnvtor003y04iwdr7tg53m', 'Small Object Detection Combining Attention Mechanism and a Novel FPN', '陈俊英,刘世鹏（学）,赵亮,陈登峰', '信息与控制工程学院', 2022, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:07.947', '2026-08-28 08:01:52.507');
INSERT INTO `publications` VALUES ('cmtcnvtot003z04iwf205yubv', '基于Web的管廊可视化信息管理系统设计与实现', '陈登峰,张温（学）,耿建勤（学）,刘国（学）,肖海燕', '建筑设备科学与工程学院', 2020, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:07.949', '2026-08-28 08:01:52.510');
INSERT INTO `publications` VALUES ('cmtcnvtov004004iw6f179w50', '无尾扑翼无人机动力学建模及仿真', '陈登峰,耿建勤（学）,张温（学）,刘国（学）', '建筑设备科学与工程学院', 2020, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:07.951', '2026-08-28 08:01:52.513');
INSERT INTO `publications` VALUES ('cmtcnvtpb004c04iwb79jghsa', 'WebGL技术在数字展览馆中的应用', '王金刚（学）,刘毅力（学）,陈登峰,王帅举（学）', '建筑设备科学与工程学院', 2019, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:07.967', '2026-08-28 08:01:52.535');
INSERT INTO `publications` VALUES ('cmtcnvtpc004d04iwpx3b6wzx', '基于WebGL的BIM模型三维可视化技术研究', '朱海林（学）,陈登峰,王帅举（学）', '建筑设备科学与工程学院', 2019, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:07.968', '2026-08-28 08:01:52.537');
INSERT INTO `publications` VALUES ('cmtcnvtpe004e04iw1jz3kagf', '基于差分GPS的无人机群小范围定位方法研究', '陈登峰,王彦柱（学）,姜翔（学）,段优（学）', '建筑设备科学与工程学院', 2019, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:07.970', '2026-08-28 08:01:52.539');
INSERT INTO `publications` VALUES ('cmtcnvtpg004f04iw24q3g9ef', '基于计算机视觉的智能果蔬结算系统', '陈登峰,周瑶（学）,段优（学）,王珂（学）', '建筑设备科学与工程学院', 2019, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:07.972', '2026-08-28 08:01:52.541');
INSERT INTO `publications` VALUES ('cmtcnvtql005504iwrpun7x8q', '四轴飞行器改进型串级姿态控制算法仿真研究', '陈登峰,姜翔（学）,王彦柱（学）,赵红亮（学）', '建筑设备科学与工程学院', 2019, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:08.013', '2026-08-28 08:01:52.584');
INSERT INTO `publications` VALUES ('cmtcnvtqm005604iwncirswre', 'BIM技术应用于建筑室内光环境分析', '张金涛（学）,陈登峰,肖海燕', '建筑设备科学与工程学院', 2016, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:08.014', '2026-08-28 08:01:52.585');
INSERT INTO `publications` VALUES ('cmtcnvtqo005704iwz0gbgxtf', '脉冲激励在线连续漏磁测量仪设计与实现', '陈登峰,薛启启（学）,肖海燕', '建筑设备科学与工程学院', 2018, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:08.016', '2026-08-28 08:01:52.588');
INSERT INTO `publications` VALUES ('cmtcnvtqp005804iwq6cfvg71', '综合管廊环境安全性模糊综合评价研究', '陈登峰,赵婷（学）,肖海燕', '建筑设备科学与工程学院', 2018, NULL, NULL, 'PENDING', NULL, '2026-08-28 08:00:08.017', '2026-08-28 08:01:52.589');
INSERT INTO `publications` VALUES ('cmtcnvtqw005d04iwbms8gkmd', '550mm可逆轧机电气控制系统改造应用', '王金刚（学）,陈登峰,史智峰（外）', '建筑设备科学与工程学院', 2018, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.024', '2026-08-28 08:01:52.599');
INSERT INTO `publications` VALUES ('cmtcnvtqx005e04iwreojidxh', '基于单片机控制的相序检测器设计', '陈登峰,陈辉（学）', '建筑设备科学与工程学院', 2018, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.025', '2026-08-28 08:01:52.600');
INSERT INTO `publications` VALUES ('cmtcnvtr1005g04iwtycmx64g', '高等学校青年教师继续培养途径刍议', '陈登峰', '建筑设备科学与工程学院', 2010, NULL, NULL, 'REJECTED', NULL, '2026-08-28 08:00:08.029', '2026-08-28 08:01:52.605');
INSERT INTO `publications` VALUES ('cmtcnvtr2005h04iw5t1pa3i1', '物联网中的智能物流仓储系统研究', '黄志雨（学）,嵇启春,陈登峰', '信息与控制工程学院', 2011, NULL, NULL, 'REJECTED', NULL, '2026-08-28 08:00:08.030', '2026-08-28 08:01:52.608');
INSERT INTO `publications` VALUES ('cmtcnvtrh005s04iwlqu00ndj', '基于复合智能控制策略的LF炉电极调节器设计', '佟威,徐胜军,陈登峰', '信息与控制工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.045', '2026-08-28 08:01:52.631');
INSERT INTO `publications` VALUES ('cmtcnvtrk005t04iwm6l562k0', '科技竞赛在高校产学研基地建设中的作用探索', '佟威,陈登峰,于军琪', '信息与控制工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.048', '2026-08-28 08:01:52.632');
INSERT INTO `publications` VALUES ('cmtcnvtrl005u04iwqgfetg4q', '校企合作共建产学研开放实验室的探索与实践', '陈登峰,赵亮,于军琪', '建筑设备科学与工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.049', '2026-08-28 08:01:52.635');
INSERT INTO `publications` VALUES ('cmtcnvtrm005v04iwmo5bnxud', '多传感器信息融合技术在酒类辨识中的应用', '陈登峰,肖海燕,张洪才（外）', '建筑设备科学与工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.050', '2026-08-28 08:01:52.637');
INSERT INTO `publications` VALUES ('cmtcnvtrn005w04iw1mm5dal2', '基于TMS320LF2407A的SVPWM变频系统的研究及实现', '卢英,陈登峰,赵亮,丁学文（外）', '信息与控制工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.051', '2026-08-28 08:01:52.639');
INSERT INTO `publications` VALUES ('cmtcnvtrp005x04iw8vs8ifx4', '基于μC/OS-11的电力线路微机继电保护装置', '卫铭斐,张小敏（外）,陈登峰,杨放', '信息与控制工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.053', '2026-08-28 08:01:52.640');
INSERT INTO `publications` VALUES ('cmtcnvtrq005y04iwc8o9pwdt', '基于灰度阈值分割的锥体零件缺陷识别算法', '罗文亮（外）,倪晋平（外）,马鸣（外）,陈登峰', '信息与控制工程学院', 2006, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.055', '2026-08-28 08:01:52.641');
INSERT INTO `publications` VALUES ('cmtcnvtrs005z04iwuyjd48x8', '基于层次分析法与模糊综合评价法的医疗设备采购绩效评价', '陈登峰,马麟（学）', '建筑设备科学与工程学院', 2016, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.056', '2026-08-28 08:01:52.643');
INSERT INTO `publications` VALUES ('cmtcnvtrt006004iwr0mgrxs5', 'Brief investigation of sensor technology and data analysis in building energy management', '陈登峰', '建筑设备科学与工程学院', 2016, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.057', '2026-08-28 08:01:52.645');
INSERT INTO `publications` VALUES ('cmtcnvtrv006104iwqtusmhml', 'Design of an instrument of magnetic maesurement for steel structures', '陈登峰,肖海燕', '建筑设备科学与工程学院', 2016, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.059', '2026-08-28 08:01:52.647');
INSERT INTO `publications` VALUES ('cmtcnvtrw006204iw9hom18yb', 'Design of an Instrument of Magnetic Measurement for Steel Structures', '陈登峰,肖海燕', '建筑设备科学与工程学院', 2015, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.060', '2026-08-28 08:01:52.648');
INSERT INTO `publications` VALUES ('cmtcnvtrx006304iw521854e4', 'Numerical Simulation of Particle Trajectory in Electrostatic Precipitator', '陈登峰,杨晓东,肖海燕', '建筑设备科学与工程学院', 2014, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.061', '2026-08-28 08:01:52.651');
INSERT INTO `publications` VALUES ('cmtcnvtrz006404iwz9z2fh7l', 'Vibration style ladle slag detection method based on discrete wavelet decomposition', '陈登峰,肖海燕,嵇启春', '建筑设备科学与工程学院', 2014, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.063', '2026-08-28 08:01:52.653');
INSERT INTO `publications` VALUES ('cmtcnvts0006504iwut4sxoru', 'Fuzzy synthetic evaluation of water quality of Hei River system.', '陈登峰,嵇启春', '建筑设备科学与工程学院', 2011, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.064', '2026-08-28 08:01:52.654');
INSERT INTO `publications` VALUES ('cmtcnvts1006604iww7xkajrb', 'Fault diagnose of rotor winding inter turn short circuit in generator', '肖海燕,陈登峰', '信息与控制工程学院', 2013, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.065', '2026-08-28 08:01:52.656');
INSERT INTO `publications` VALUES ('cmtcnvts2006704iw96l0f75v', 'A Kind of Efficient and Energy Saving Pulsed High-Voltage Supplying Technology of Electrostatic Precipitator', '陈登峰,王育平（外）,董慧（外）', '建筑设备科学与工程学院', 2012, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.066', '2026-08-28 08:01:52.657');
INSERT INTO `publications` VALUES ('cmtcnvts3006804iwkmq2e8rb', 'High-voltage Pulse Power Supply Controller based on ARM7', '陈登峰,李梦（外）,于军琪,肖海燕', '建筑设备科学与工程学院', 2011, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.068', '2026-08-28 08:01:52.659');
INSERT INTO `publications` VALUES ('cmtcnvts5006904iw8065ge9j', '一种CMOS工艺离子敏场效应型晶体管的模型', '卫铭斐,于军琪,陈登峰', '信息与控制工程学院', 2011, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.069', '2026-08-28 08:01:52.660');
INSERT INTO `publications` VALUES ('cmtcnvts7006a04iwzrq7p4gy', 'Concrete CT image segmentation using Modified Metropolis Dynamics', '赵亮,李昌华,陈登峰', '信息与控制工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.071', '2026-08-28 08:01:52.680');
INSERT INTO `publications` VALUES ('cmtcnvts8006b04iwk2k25t08', '基于CT图像的建筑混凝土破裂细观结构智能处理分析', '赵亮,李昌华,党发宁（外）,陈登峰,毛建东', '信息与控制工程学院', 2010, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.072', '2026-08-28 08:01:52.663');
INSERT INTO `publications` VALUES ('cmtcnvts9006c04iw62l1koog', '一种基于信任传播的混凝土CT图像分割方法', '赵亮,李昌华,陈登峰,党发宁（外）,徐胜军', '信息与控制工程学院', 2010, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.073', '2026-08-28 08:01:52.665');
INSERT INTO `publications` VALUES ('cmtcnvtsa006d04iwkrrlhbw8', '基于双MCU的ZigBee技术硬件平台设计', '黄志雨（外）,嵇启春,陈登峰', '信息与控制工程学院', 2010, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.074', '2026-08-28 08:01:52.667');
INSERT INTO `publications` VALUES ('cmtcnvtsc006e04iw27zeqd9b', '基于SIFT特征和粒子滤波的目标跟踪方法', '牛长锋（外）,陈登峰', '信息与控制工程学院', 2010, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.076', '2026-08-28 08:01:52.668');
INSERT INTO `publications` VALUES ('cmtcnvtsd006f04iw5mp242v3', 'The application of AC position servo-control in automatic gamma counters', '陈登峰,嵇启春,赵亮', '建筑设备科学与工程学院', 2010, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.077', '2026-08-28 08:01:52.670');
INSERT INTO `publications` VALUES ('cmtcnvtsf006g04iwkdrstnfv', '基于马尔可夫随机场的改进METROPOLIS混凝土CT的图像分割方法', '赵亮,李昌华,党发宁（外）,陈登峰,徐胜军', '信息与控制工程学院', 2010, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.079', '2026-08-28 08:01:52.673');
INSERT INTO `publications` VALUES ('cmtcnvtsg006h04iwdhe1fyny', '脉冲涡流在金属厚度检测中的应用研究', '赵亮,陈登峰,卢英,于军琪', '信息与控制工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.080', '2026-08-28 08:01:52.705');
INSERT INTO `publications` VALUES ('cmtcnvtsh006i04iwtc9pohko', '建筑电气与智能化专业教学团队建设的理念与策略', '嵇启春,段中兴,陈登峰', '信息与控制工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.081', '2026-08-28 08:01:52.676');
INSERT INTO `publications` VALUES ('cmtcnvtsj006j04iwb8t23tlt', '基于噪声频谱的磨煤机负荷测量仪研究', '赵亮,陈登峰,于军琪,李昌华', '信息与控制工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.083', '2026-08-28 08:01:52.679');
INSERT INTO `publications` VALUES ('cmtcnvtss006k04iwij6156oj', '工程研究应用型自动化专业实践教学的探索', '陈登峰,嵇启春,肖海燕,佟威', '建筑设备科学与工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.092', '2026-08-28 08:01:52.682');
INSERT INTO `publications` VALUES ('cmtcnvtst006l04iwpljtoprm', '大学生科技创新活动的研究与探索', '陈登峰,嵇启春,赵亮,卢英', '建筑设备科学与工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.093', '2026-08-28 08:01:52.684');
INSERT INTO `publications` VALUES ('cmtcnvtsu006m04iwl2pxvla4', 'Application of Pulsed Eddy Current and Ultrasonic Sensors in Paint Film Thickness Measuring', '陈登峰,嵇启春,赵亮', '建筑设备科学与工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.094', '2026-08-28 08:01:52.686');
INSERT INTO `publications` VALUES ('cmtcnvtsv006n04iwv9f3b1ep', 'The classification of wine based on PCA and ANN', '陈登峰,嵇启春,赵亮', '建筑设备科学与工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.095', '2026-08-28 08:01:52.687');
INSERT INTO `publications` VALUES ('cmtcnvtsx006o04iwhbeq0rd7', 'Application of Pulsed Eddy Current in Plate Thickness Evaluation', '嵇启春,赵亮,陈登峰', '建筑设备科学与工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.097', '2026-08-28 08:01:52.689');
INSERT INTO `publications` VALUES ('cmtcnvtsz006p04iwee4pyd56', '浅谈智能建筑在部队营区中的应用与发展', '汪洋（外）,陈登峰,冯增喜', '信息与控制工程学院', 2009, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.099', '2026-08-28 08:01:52.690');
INSERT INTO `publications` VALUES ('cmtcnvtt0006q04iwycegln6e', 'CONTROL TECHNOLOGY IN INTELLIGENT BUILDING FOR ENERGY SAVING', '于军琪,冯增喜,刘胜荣（外）,陈登峰', '建筑设备科学与工程学院', 2008, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.100', '2026-08-28 08:01:52.692');
INSERT INTO `publications` VALUES ('cmtcnvtt3006r04iwnxw6cop0', '多属性目标决策的分类融合威胁排序的模型', '陈登峰,嵇启春', '建筑设备科学与工程学院', 2008, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.103', '2026-08-28 08:01:52.694');
INSERT INTO `publications` VALUES ('cmtcnvtt4006s04iw54ta6y2r', '基于DSP智能变压器多参数测试仪的设计', '赵亮,陈登峰,李昌华,于军琪', '信息与控制工程学院', 2008, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.104', '2026-08-28 08:01:52.696');
INSERT INTO `publications` VALUES ('cmtcnvtt5006t04iw5rvr5phi', '交流伺服位置控制系统的研究与应用', '卢英,赵亮,陈登峰,佟威', '信息与控制工程学院', 2008, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.105', '2026-08-28 08:01:52.697');
INSERT INTO `publications` VALUES ('cmtcnvtt7006u04iwdbe7bb43', '主成分分析的模糊神经网络目标识别系统', '陈登峰,嵇启春', '建筑设备科学与工程学院', 2008, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.107', '2026-08-28 08:01:52.699');
INSERT INTO `publications` VALUES ('cmtcnvtt8006v04iwvfavb9je', 'Optimized Load Control System for Coal Pulverizing System with Intermediate Storage Bunker Ball Mills', '陈登峰,嵇启春', '建筑设备科学与工程学院', 2008, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.108', '2026-08-28 08:01:52.701');
INSERT INTO `publications` VALUES ('cmtcnvtt9006w04iwoi8yc845', 'Fuzzy Synthetic Evaluation of Indoor Environmental Quality based on Changeable Weight', '陈登峰,嵇启春', '建筑设备科学与工程学院', 2008, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.109', '2026-08-28 08:01:52.702');
INSERT INTO `publications` VALUES ('cmtcnvttb006x04iwkxj064kc', 'Material Blending and Pulverization Control System in Cement Industries', '陈登峰,嵇启春', '建筑设备科学与工程学院', 2008, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.111', '2026-08-28 08:01:52.704');
INSERT INTO `publications` VALUES ('cmtcnvttf006y04iw33fyrcly', '冲突证据的目标识别系统的研究', '陈登峰,嵇启春,张洪才（外）', '建筑设备科学与工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.115', '2026-08-28 08:01:52.707');
INSERT INTO `publications` VALUES ('cmtcnvttg006z04iwjbd2hsr0', '校企合作、注重实践的创新型人才培养模式探讨', '于军琪,冯增喜,陈登峰,任庆昌', '建筑设备科学与工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.116', '2026-08-28 08:01:52.709');
INSERT INTO `publications` VALUES ('cmtcnvttj007004iwyr49t3yz', '控制理论精品课程建设的探索与实践', '嵇启春,陈登峰,佟威', '信息与控制工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.119', '2026-08-28 08:01:52.711');
INSERT INTO `publications` VALUES ('cmtcnvttl007104iwi2t64m5m', '专业发展和人才培养的核心', '嵇启春,陈登峰,佟威', '信息与控制工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.121', '2026-08-28 08:01:52.714');
INSERT INTO `publications` VALUES ('cmtcnvttn007204iwgzdmyixs', '关于测控技术与仪器专业课程设计教学方法的探讨', '肖海燕,赵亮,陈登峰', '信息与控制工程学院', 2007, NULL, NULL, 'APPROVED', NULL, '2026-08-28 08:00:08.123', '2026-08-28 08:01:52.716');

-- ----------------------------
-- Table structure for site_settings
-- ----------------------------
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `site_settings_key_key`(`key` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of site_settings
INSERT INTO `site_settings` VALUES ('cmpuumgdp00030klfwr33n67y', 'lab_name', '数智管网・建科新能', '2026-06-01 15:40:39.312');
INSERT INTO `site_settings` VALUES ('cmpuumgdw00040klfejho1zyv', 'lab_subtitle', '致力于前沿科学研究，推动技术创新与突破', '2026-06-01 15:40:39.319');
INSERT INTO `site_settings` VALUES ('cmpuumge100050klfg0eos68v', 'lab_description', '聚焦城市路桥与地下管网智能检测、建筑机器人应用与风光水储能源系统优化，推动智慧城市基础设施智能化运维技术进步。', '2026-06-01 15:40:39.325');
INSERT INTO `site_settings` VALUES ('cmpuumge600060klf722jb480', 'admission_info', '课题组常年招收对科研充满热情的博士研究生和硕士研究生。我们提供良好的科研环境、充足的研究经费和丰富的学术交流机会。', '2026-06-01 15:40:39.331');
INSERT INTO `site_settings` VALUES ('cmpuumgec00070klf6hazwz5s', 'contact_email', 'contact@example.com', '2026-06-01 15:40:39.337');


-- ----------------------------
-- Table structure for software_copyrights
-- ----------------------------
DROP TABLE IF EXISTS `software_copyrights`;
CREATE TABLE `software_copyrights`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `registration_date` datetime(3) NULL DEFAULT NULL,
  `review_status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'APPROVED',
  `submitted_by` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of software_copyrights
-- ----------------------------
INSERT INTO `software_copyrights` VALUES ('cmtcnvtnc003204iw0w74dqtu', '一种设备智慧运维软件', 'IMPORT-f8d345f6d983', NULL, '2022-07-01 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.896', '2026-08-28 08:01:52.440');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtne003304iwa9s3pczm', '一种智慧物流大数据服务软件', 'IMPORT-399953cd3529', NULL, '2022-07-22 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.898', '2026-08-28 08:01:52.444');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtnf003404iwr4l4nmq2', '一种智慧物联数据统计软件', 'IMPORT-f38bf4ca1f0c', NULL, '2022-07-22 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.899', '2026-08-28 08:01:52.447');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtns003c04iw97msar8c', '桥梁挠度等监测数据组合降噪软件', 'IMPORT-00357bf73e42', NULL, '2024-04-15 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.912', '2026-08-28 08:01:52.465');
INSERT INTO `software_copyrights` VALUES ('cmtcnvto5003k04iwnykfehx7', '基于级联网络的城市道路隐蔽性病害识别软件', 'IMPORT-7e54a1b01e9f', NULL, '2023-01-10 00:00:00.000', 'PENDING', NULL, '2026-08-28 08:00:07.925', '2026-08-28 08:01:52.481');
INSERT INTO `software_copyrights` VALUES ('cmtcnvto7003l04iwff0wywwc', '基于数据可视化的桥梁病害监测软件', 'IMPORT-900955ebf865', NULL, '2021-08-01 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.927', '2026-08-28 08:01:52.484');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtod003o04iwx4hs5913', '建筑信息可视化平台', 'IMPORT-721d1f7bbe86', NULL, '2020-07-10 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.933', '2026-08-28 08:01:52.489');
INSERT INTO `software_copyrights` VALUES ('cmtcnvton003v04iwyh7c2exu', '一种智慧城市软件', 'IMPORT-69da83a20f76', NULL, '2022-05-22 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.943', '2026-08-28 08:01:52.501');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtop003x04iw0g4abdqt', '岩土工程智能监测云信息系统', 'IMPORT-b4ed16dc4c26', NULL, '2021-12-13 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.945', '2026-08-28 08:01:52.505');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtow004104iwa1krxvnh', '桥梁信息管理系统', 'IMPORT-516da5a14e96', NULL, '2021-08-04 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.952', '2026-08-28 08:01:52.514');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtox004204iwzt6gkqgi', '工地安全帽检测平台', 'IMPORT-5939a453299a', NULL, '2020-10-15 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.953', '2026-08-28 08:01:52.515');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtoy004304iwo7oq1n8l', '佩戴口罩检测平台', 'IMPORT-9e71765a1fb7', NULL, '2020-10-15 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.954', '2026-08-28 08:01:52.517');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtpv004o04iwn2bwm6he', '建筑模型可视化平台', 'IMPORT-6f974274ab6d', NULL, '2020-07-10 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.987', '2026-08-28 08:01:52.557');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtpw004p04iwyv326ath', '基于一种改进蚁群算法仓库管理软件', 'IMPORT-ec6f55d22621', NULL, '2020-07-22 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.988', '2026-08-28 08:01:52.558');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtq6004v04iwqzq4335w', '跨平台图片查阅存储平台', 'IMPORT-ae2c534e7146', NULL, '2019-09-10 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.998', '2026-08-28 08:01:52.569');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtq7004w04iwy0ncyq78', '教研室跨平台聊天系统', 'IMPORT-a47a8a898105', NULL, '2019-09-11 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:07.999', '2026-08-28 08:01:52.571');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqa004y04iw0ilp4lm6', '基于WebGL的网页3D模型导入交互系统', 'IMPORT-5f590785fcff', NULL, '2019-06-17 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.002', '2026-08-28 08:01:52.575');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqb004z04iw4qdezmkv', '教研室图片共享系统', 'IMPORT-8d12dd88b810', NULL, '2019-06-17 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.003', '2026-08-28 08:01:52.576');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqd005004iwaat5imde', 'Revit建筑构件信息采集系统', 'IMPORT-009a92b6108a', NULL, '2019-06-17 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.005', '2026-08-28 08:01:52.577');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqe005104iw8d1n68fc', '基于Web的通讯及数据处理平台', 'IMPORT-bc9434b15563', NULL, '2019-05-17 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.006', '2026-08-28 08:01:52.578');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqg005204iw22d3hyqg', '实验室在线会议平台', 'IMPORT-1a8c9f2d19e9', NULL, '2019-05-17 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.008', '2026-08-28 08:01:52.579');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqh005304iw9spp3gi8', '一种轻量化Office浏览软件', 'IMPORT-5479a89579ab', NULL, '2019-05-08 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.009', '2026-08-28 08:01:52.581');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqj005404iwgppm6rg5', '一种轻量化数据可视化软件', 'IMPORT-c7be42bf7045', NULL, '2019-05-08 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.011', '2026-08-28 08:01:52.583');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqq005904iw7y38gtcm', '脚本式智能自动成绩录入软件', 'IMPORT-a91f50802059', NULL, '2019-02-18 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.018', '2026-08-28 08:01:52.592');
INSERT INTO `software_copyrights` VALUES ('cmtcnvtqs005a04iwsqv8ku2k', '智能家居环境监测控制平台', 'IMPORT-9845a29d1c86', NULL, '2019-02-02 00:00:00.000', 'APPROVED', NULL, '2026-08-28 08:00:08.020', '2026-08-28 08:01:52.593');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','MEMBER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MEMBER',
  `status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `title` enum('TEACHER','MASTER','ALUMNI') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `grade` int NULL DEFAULT NULL,
  `avatar_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_email_key`(`email` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
INSERT INTO `users` VALUES ('cmpe6rozw00000kmj4hqns0g3', '启航', '', '794934535@qq.com', '$2b$10$6L39pb4YIbLr4pKsGCwX2.Kk69jXUHOiRJAUxKPM7/sOIDKY0kQgu', 'SUPER_ADMIN', 'APPROVED', 'MASTER', 1, NULL, '2026-05-20 14:57:44.780', '2026-08-27 13:32:18.560');
INSERT INTO `users` VALUES ('cmpjp92bs00000lngf7bwo0d9', '苏诺', '2416212740', '2398935603@qq.com', '$2b$10$Kat6YIJai2TUyAtZcG1wGeF950D0bQlWrJF6QBTpfvHE6BAEdfli.', 'SUPER_ADMIN', 'APPROVED', 'MASTER', 2, NULL, '2026-05-24 11:33:59.176', '2026-05-31 10:32:27.617');
INSERT INTO `users` VALUES ('cmpjqsg6000000km9480edytu', '张嘉烨', '2204020203', '3419455477@qq.com', '$2b$10$VibIohSNAVlaMhGbYf1pOOYP32HsZIdlTOuWqAVD2JfPN2Uq6YzOu', 'MEMBER', 'APPROVED', NULL, NULL, NULL, '2026-05-24 12:17:03.192', '2026-05-27 07:58:51.010');
INSERT INTO `users` VALUES ('cmpjqsp5s00010km9f60fd49t', '孙雅昕', '2416212763', '1963747049@qq.com', '$2b$10$NWzpSw7t3JmeZAErTdpUruFzXQaWLufP29TWPaIBCDpb6sLoKtdN.', 'MEMBER', 'APPROVED', NULL, NULL, NULL, '2026-05-24 12:17:14.848', '2026-05-27 07:58:50.622');
INSERT INTO `users` VALUES ('cmpjr9fmk00020km9tffuvjhi', '王昕昊', '2516212669', 'wangxinhao9@xauat.edu.cn', '$2b$10$GhKA3Duz9HX10.wJpalc7eeCVRTG2eQ2veFiVz9kmBYosb2sPcOPS', 'MEMBER', 'APPROVED', NULL, NULL, NULL, '2026-05-24 12:30:15.644', '2026-05-27 07:58:50.073');
INSERT INTO `users` VALUES ('cmpjrjjz600030km9x2ovykvw', '王泽鹏', '2316212734', 'wzp@xauat.edu.cn', '$2b$10$gzVtZCqSyXRKICSNYIVliunCLlk2egCLDXbDst.CieiCbq698WMHm', 'MEMBER', 'APPROVED', NULL, NULL, NULL, '2026-05-24 12:38:07.842', '2026-05-27 07:58:49.006');
INSERT INTO `users` VALUES ('cmpjrkksc00040km9pe8ktdbu', '李皓明', '2316212725', 'lhm020921@xauat.edu.cn', '$2b$10$q5RDodfmJzbA0ZccZTfo6eHCq3zslPoYVqw/mB.pnEVLk./702WGG', 'MEMBER', 'APPROVED', NULL, NULL, NULL, '2026-05-24 12:38:55.548', '2026-05-27 07:58:47.959');
INSERT INTO `users` VALUES ('cmpjws8sp00050km9k2bq4inu', '李孟颖', '', '2542012113@qq.com', '$2b$10$cDQuzdqJUWbJNNxsNM7PIOME7YpFZqZAorh/9znuiqNZ71HYi53WO', 'MEMBER', 'APPROVED', NULL, NULL, NULL, '2026-05-24 15:04:51.337', '2026-05-27 07:58:46.886');
INSERT INTO `users` VALUES ('cmpl637ee00060km9u1wxitwp', '彭腾', '2516212668', '2605748815@qq.com', '$2b$10$Ner9i1Hs0P5oPR00owEPmu3I9GVDVYU4qrGcxazRFX74LGwjPWL1W', 'MEMBER', 'APPROVED', NULL, NULL, NULL, '2026-05-25 12:13:05.462', '2026-05-27 07:58:45.781');
INSERT INTO `users` VALUES ('cmpr15kfz00000klfpsa305wp', '陈老师', '', '13891939621@163.com', '$2b$10$6Uda4FjZlTRsByaHwoI9HeFqUHUGy7lQPujFXV.KmHF3hol7JKApK', 'SUPER_ADMIN', 'APPROVED', 'TEACHER', NULL, NULL, '2026-05-29 14:41:34.655', '2026-05-29 14:41:55.212');
INSERT INTO `users` VALUES ('cmpz40tay000r0ko16osgzm4z', '公文倩', '2508811781', '2291754029@qq.com', '$2b$10$sec9vKm.ultYJihvJkuzqedKrcu9LH/NBX64YdyttdLctERy7zA2C', 'MEMBER', 'APPROVED', 'MASTER', 1, NULL, '2026-06-04 06:24:01.114', '2026-06-04 07:17:32.358');
INSERT INTO `users` VALUES ('cmpzaak26000t0ko1nkipag3p', '梁伟', '2516212695', '1165326278@qq.com', '$2b$10$kDabE7bGsS2Gym.zqcAtZOl6v.KJfp5rey4pPETYfQBaDyRRwvDLO', 'MEMBER', 'APPROVED', 'MASTER', 1, NULL, '2026-06-04 09:19:33.390', '2026-06-04 09:47:40.442');
INSERT INTO `users` VALUES ('cmpzc2o0v000v0ko1pnj56but', '张中霖', '2316212739', 'zhang_zhonglin215@xauat.edu.cn', '$2b$10$OSHcd9oS.PFlJn4ZzPqnXuIvF/Se5isu3lQYW00d.VUrh6AZ2e5Ey', 'MEMBER', 'APPROVED', 'MASTER', 3, NULL, '2026-06-04 10:09:24.511', '2026-06-04 10:10:45.665');


SET FOREIGN_KEY_CHECKS = 1;
