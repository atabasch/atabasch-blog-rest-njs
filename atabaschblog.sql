-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost:3306
-- Üretim Zamanı: 17 Ağu 2022, 13:51:37
-- Sunucu sürümü: 5.7.33
-- PHP Sürümü: 8.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `atabaschblog`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment_content` text NOT NULL,
  `comment_email` varchar(50) DEFAULT NULL,
  `comment_person` varchar(25) DEFAULT NULL,
  `comment_status` enum('none','publish','trash') NOT NULL DEFAULT 'none',
  `comment_c_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_u_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comment_d_time` timestamp NULL DEFAULT NULL,
  `comment_p_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `comments`
--

INSERT INTO `comments` (`comment_id`, `post_id`, `user_id`, `comment_content`, `comment_email`, `comment_person`, `comment_status`, `comment_c_time`, `comment_u_time`, `comment_d_time`, `comment_p_time`) VALUES
(1, 1, NULL, 'Merhaba, bu bir yorumdur.', 'asw13tr@gmail.com', 'Furkan A', 'none', '2022-08-15 19:00:06', '2022-08-15 19:00:06', NULL, NULL),
(2, 2, 2, 'Merhaba, bu ikiinci bir yorumdur.', NULL, NULL, 'publish', '2022-08-15 19:01:26', '2022-08-15 19:01:26', NULL, NULL),
(4, 20, 22, 'Bunu al yeni göndev, kaVDEŞİM HELİKOPTEv', 'ortamınortadaportalıboz@babanhortladıkoşma.lan', 'Falan filan', 'none', '2022-08-15 19:01:46', '2022-08-16 01:23:28', NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contacts`
--

CREATE TABLE `contacts` (
  `contact_id` int(11) NOT NULL,
  `contact_title` varchar(250) NOT NULL,
  `contact_content` text NOT NULL,
  `contact_person` varchar(60) NOT NULL,
  `contact_email` varchar(60) NOT NULL,
  `contact_status` enum('none','read','answered') NOT NULL DEFAULT 'none',
  `contact_datas` text,
  `contact_c_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contact_u_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `contacts`
--

INSERT INTO `contacts` (`contact_id`, `contact_title`, `contact_content`, `contact_person`, `contact_email`, `contact_status`, `contact_datas`, `contact_c_time`, `contact_u_time`) VALUES
(1, 'Merhaaba', 'bir konu hakkında yardıma iihtiyacım var', 'Furkan A', 'atabas@gmail.com', 'none', NULL, '2022-08-16 21:55:55', '2022-08-16 21:55:55'),
(2, 'Burak Oyunda', 'Selamlar ben oyundaydım çıkamıyorum', 'Burakk', 'bur@ak.com', 'none', NULL, '2022-08-16 22:06:26', '2022-08-16 22:06:26'),
(3, '', 'Abi selam monitör aldım 165hz diye 164 veriyör.', 'Gigabyte Bozuldu', 'bozuk@gigabyte.net', 'none', NULL, '2022-08-16 22:07:41', '2022-08-16 22:07:41'),
(5, 'Burak oyundaydı', 'Burak demin oyundaydı ama canı sıkıldı ve artık oynamak istemediğini söyledi. Ve oyunu ALT+F4 atarak terk etti.', 'Burak Oyunda mı', 'burak@murak.com', 'none', NULL, '2022-08-17 02:31:39', '2022-08-17 02:31:39'),
(6, 'Burak oyundaydı', 'Burak demin oyundaydı ama canı sıkıldı ve artık oynamak istemediğini söyledi. Ve oyunu ALT+F4 atarak terk etti.', 'Burak Oyunda mı', 'burak@murak.com', 'none', NULL, '2022-08-17 02:32:53', '2022-08-17 02:32:53');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `galleries`
--

CREATE TABLE `galleries` (
  `gallery_id` int(11) NOT NULL,
  `gallery_title` varchar(200) NOT NULL,
  `gallery_slug` varchar(200) NOT NULL,
  `gallery_description` varchar(255) DEFAULT NULL,
  `gallery_images` text,
  `gallery_cover` varchar(200) NOT NULL,
  `gallery_status` enum('none','publish','draft') NOT NULL DEFAULT 'none',
  `gallery_c_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gallery_u_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `gallery_d_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `medias`
--

CREATE TABLE `medias` (
  `media_id` int(11) NOT NULL,
  `media_title` varchar(250) NOT NULL,
  `media_slug` varchar(250) NOT NULL,
  `media_file` varchar(250) NOT NULL,
  `media_type` varchar(50) NOT NULL,
  `media_data` text,
  `media_c_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `media_u_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `media_d_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `menus`
--

CREATE TABLE `menus` (
  `menu_id` int(10) UNSIGNED NOT NULL,
  `menu_title` varchar(25) NOT NULL,
  `menu_slug` varchar(25) NOT NULL,
  `menu_description` varchar(250) DEFAULT NULL,
  `menu_status` enum('none','publish') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `menus`
--

INSERT INTO `menus` (`menu_id`, `menu_title`, `menu_slug`, `menu_description`, `menu_status`) VALUES
(1, 'Ana menü', 'ana-menu', 'açıklama yapmaya gerke yok', 'none'),
(2, 'Sidebar menu', 'sidebar-menu', NULL, 'publish'),
(4, 'Sosyal Ağlar', 'sosyal-aglar', 'Sosyal medya hesaplarımızı takip edin', 'publish'),
(5, 'links', 'links', NULL, 'publish');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `menu_items`
--

CREATE TABLE `menu_items` (
  `meit_id` int(10) UNSIGNED NOT NULL,
  `menu_id` int(10) UNSIGNED NOT NULL,
  `term_id` int(10) UNSIGNED DEFAULT '0',
  `meit_parent` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `meit_title` varchar(200) NOT NULL,
  `meit_path` varchar(250) DEFAULT NULL,
  `meit_order` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `meit_data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `menu_items`
--

INSERT INTO `menu_items` (`meit_id`, `menu_id`, `term_id`, `meit_parent`, `meit_title`, `meit_path`, `meit_order`, `meit_data`) VALUES
(3, 5, 0, 0, 'Anasayfa', '/homepage', 0, NULL),
(4, 5, 0, 0, 'hakkımızda', '/about-us', 1, NULL),
(6, 4, 0, 0, 'telefonlar', NULL, 0, NULL),
(7, 40, 20, 10, 'Rasperry PI', '/RASPERRY-Pİ', 30, NULL),
(8, 4, 2, 0, 'Tabletler', '/tablets', 2, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `posts`
--

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL,
  `post_title` varchar(255) NOT NULL,
  `post_slug` varchar(255) NOT NULL,
  `post_descritpion` varchar(255) DEFAULT NULL,
  `post_content` text,
  `post_cover` varchar(64) DEFAULT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `post_status` enum('publish','draft','trash') NOT NULL DEFAULT 'draft',
  `post_type` enum('post','page') NOT NULL DEFAULT 'post',
  `post_parent` int(11) NOT NULL,
  `post_c_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_u_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `post_d_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `post_term`
--

CREATE TABLE `post_term` (
  `pote_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `taxonomies`
--

CREATE TABLE `taxonomies` (
  `tax_id` int(11) NOT NULL,
  `tax_title` varchar(200) NOT NULL,
  `tax_slug` varchar(200) NOT NULL,
  `tax_description` varchar(255) DEFAULT NULL,
  `tax_status` enum('publish','trash') NOT NULL DEFAULT 'publish'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `taxonomies`
--

INSERT INTO `taxonomies` (`tax_id`, `tax_title`, `tax_slug`, `tax_description`, `tax_status`) VALUES
(1, 'Kategoriler', 'kategoriler', 'Site genel kategorileri', 'publish'),
(2, 'Etiket Başlıkları', 'etiket-basliklari', 'Blog yazıları etiketleri için', 'publish'),
(3, 'Ürün Kategorileri', 'urun-kategorileri', NULL, 'publish'),
(4, 'Fikirler', 'fikirler', NULL, 'trash'),
(8, 'Güncellenmiş içerik2', 'guncellenmis-icerik2', 'Yeni bir açıklama2', 'trash'),
(11, 'Categories', 'categories', 'Header menü', 'publish'),
(12, 'Yeni taxo', 'yeni-taxo', 'Mesela bir şey ler', 'publish');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `terms`
--

CREATE TABLE `terms` (
  `term_id` int(11) NOT NULL,
  `tax_id` int(11) NOT NULL,
  `term_title` varchar(160) NOT NULL,
  `term_slug` varchar(160) NOT NULL,
  `term_description` varchar(250) DEFAULT NULL,
  `term_parent` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `term_order` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `terms`
--

INSERT INTO `terms` (`term_id`, `tax_id`, `term_title`, `term_slug`, `term_description`, `term_parent`, `term_order`) VALUES
(1, 2, 'Bilgisayar', 'bilgisayar', 'bilgisayar bloğu', 0, 0),
(2, 1, 'Yazılım', 'yazilim', NULL, 1, 0),
(3, 2, 'Elektronik', 'elektronik', NULL, 1, 0),
(4, 2, 'Beyaz eşya', 'beyaz-esya', NULL, 1, 0),
(6, 4, 'Otomobil', 'otomobil', 'Otomobil tamiri ile alakalı bilgiiler.', 1, 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(60) NOT NULL,
  `user_password` varchar(60) NOT NULL,
  `user_email` varchar(60) NOT NULL,
  `user_displayname` varchar(60) DEFAULT NULL,
  `user_image` varchar(160) DEFAULT NULL,
  `user_level` enum('none','banned','active','editor','admin') NOT NULL DEFAULT 'none',
  `user_c_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_u_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_d_time` timestamp NULL DEFAULT NULL,
  `user_l_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_password`, `user_email`, `user_displayname`, `user_image`, `user_level`, `user_c_time`, `user_u_time`, `user_d_time`, `user_l_time`) VALUES
(1, 'asw13tr', '123456', 'asw13tr@gmail.com', 'AtabasSoftware', NULL, 'active', '2022-08-11 18:18:31', '2022-08-11 18:18:31', NULL, NULL),
(2, 'atabas61', '234567', 'atabas61@hotmail.com', 'Atabaş Yazılım', 'image.png', 'admin', '2022-08-11 18:18:31', '2022-08-11 18:18:31', NULL, NULL),
(3, 'atabasch7', '741258963', 'atabasch7@outlook.com.tr', 'Atabasch Online', 'atabasch.jpg', 'editor', '2022-08-11 18:20:14', '2022-08-11 18:20:14', NULL, NULL),
(4, 'globalnoob', '78965412630', 'globalnoob91@gmail.com', 'Global Noob', NULL, 'none', '2022-08-11 18:20:14', '2022-08-11 18:20:14', NULL, NULL),
(12, 'nodejs_user', 'nodejs_password', 'nodejs@npm.com', NULL, NULL, 'active', '2022-08-13 16:43:11', '2022-08-13 16:43:11', NULL, NULL),
(15, 'php9', 'php9PassWord', '9@php.net', 'Php8.1 Language', 'php09.png', 'editor', '2022-08-13 16:47:24', '2022-08-14 13:28:49', '2022-08-13 17:12:40', NULL),
(19, 'Lays', 'laysPassword', 'cips@lays.com', 'Lays Cips', 'lays.png', 'editor', '2022-08-13 16:56:17', '2022-08-13 22:13:15', NULL, NULL),
(23, 'furkan_atabas', 'furkan_pass', 'furkan_atabas@hotmail.com', NULL, 'update_Edilmis.png', 'active', '2022-08-13 16:59:55', '2022-08-13 22:11:45', NULL, NULL),
(26, 'termos', 'termosPass', 'termos@termoss.com', NULL, NULL, 'active', '2022-08-13 18:45:29', '2022-08-13 18:45:29', NULL, NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users_data`
--

CREATE TABLE `users_data` (
  `user_id` int(11) NOT NULL,
  `user_firstname` varchar(25) DEFAULT NULL,
  `user_lastname` varchar(25) DEFAULT NULL,
  `user_birthdate` date DEFAULT NULL,
  `user_gender` enum('none','male','female') NOT NULL DEFAULT 'none',
  `user_langcode` varchar(4) DEFAULT NULL,
  `user_timezone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `users_data`
--

INSERT INTO `users_data` (`user_id`, `user_firstname`, `user_lastname`, `user_birthdate`, `user_gender`, `user_langcode`, `user_timezone`) VALUES
(1, 'Furkan ', 'Atabaş', '1991-06-13', 'male', 'tr', 'Europa/Istanbul'),
(4, 'Global', 'Noob', '2020-01-01', 'female', 'en', 'Europa/Istanbul'),
(12, 'Node', 'JS', '1991-06-13', 'none', 'tr', 'Europa/Istanbul'),
(15, 'Programming', 'Language', '1991-12-12', 'male', 'tr', 'Europa/Istanbul'),
(19, 'Pring', 'Less', '2005-05-03', 'none', 'tr', 'Europa/Istanbul'),
(23, 'Furkan', 'furkan', '2005-05-03', 'none', 'tr', 'Europa/Istanbul'),
(26, 'Termos', 'iki liter', '2005-05-03', 'none', 'tr', 'Europa/Istanbul');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`contact_id`);

--
-- Tablo için indeksler `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`gallery_id`);

--
-- Tablo için indeksler `medias`
--
ALTER TABLE `medias`
  ADD PRIMARY KEY (`media_id`);

--
-- Tablo için indeksler `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`menu_id`);

--
-- Tablo için indeksler `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`meit_id`),
  ADD KEY `term_id` (`term_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Tablo için indeksler `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `post_user` (`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `post_term`
--
ALTER TABLE `post_term`
  ADD PRIMARY KEY (`pote_id`),
  ADD KEY `post_id` (`post_id`,`term_id`),
  ADD KEY `term_id` (`term_id`);

--
-- Tablo için indeksler `taxonomies`
--
ALTER TABLE `taxonomies`
  ADD PRIMARY KEY (`tax_id`);

--
-- Tablo için indeksler `terms`
--
ALTER TABLE `terms`
  ADD PRIMARY KEY (`term_id`),
  ADD KEY `tax_id` (`tax_id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- Tablo için indeksler `users_data`
--
ALTER TABLE `users_data`
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `user_id_2` (`user_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `contacts`
--
ALTER TABLE `contacts`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `galleries`
--
ALTER TABLE `galleries`
  MODIFY `gallery_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `medias`
--
ALTER TABLE `medias`
  MODIFY `media_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `menus`
--
ALTER TABLE `menus`
  MODIFY `menu_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `meit_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `post_term`
--
ALTER TABLE `post_term`
  MODIFY `pote_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `taxonomies`
--
ALTER TABLE `taxonomies`
  MODIFY `tax_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Tablo için AUTO_INCREMENT değeri `terms`
--
ALTER TABLE `terms`
  MODIFY `term_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `post_term`
--
ALTER TABLE `post_term`
  ADD CONSTRAINT `post_term_ibfk_1` FOREIGN KEY (`term_id`) REFERENCES `terms` (`term_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `post_term_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `terms`
--
ALTER TABLE `terms`
  ADD CONSTRAINT `terms_ibfk_1` FOREIGN KEY (`tax_id`) REFERENCES `taxonomies` (`tax_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Tablo kısıtlamaları `users_data`
--
ALTER TABLE `users_data`
  ADD CONSTRAINT `users_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
