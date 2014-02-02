-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 02. Feb 2014 um 00:47
-- Server Version: 5.5.27
-- PHP-Version: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `linkpage`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `personen`
--

CREATE TABLE IF NOT EXISTS `personen` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `vorname` varchar(50) NOT NULL,
  `nachname` varchar(50) NOT NULL,
  `benutzer` varchar(50) DEFAULT NULL,
  `passwort` char(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `isAdmin` int(1) DEFAULT '0',
  `createDate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `benutzer` (`benutzer`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Daten für Tabelle `personen`
--

INSERT INTO `personen` (`id`, `vorname`, `nachname`, `benutzer`, `passwort`, `email`, `isAdmin`, `createDate`) VALUES
(3, 'David', 'Ziemann', 'ziedav', '1af35e2d8e96fd078e05ad82d7bddecd', 'david.ziemann@gmail.com', 1, '2014-01-30'),
(4, 'Tim', 'Wehr', 'wehrtim', '50dfb46c91869d827839fd4a1107fd36', 'tim.wehr@hatkeinemail.de', 0, '2014-01-30'),
(5, 'Andre', 'Stehle', 'tht', '81dc9bdb52d04dc20036dbd8313ed055', 't@c.com', 0, '2014-01-30');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `seiten`
--

CREATE TABLE IF NOT EXISTS `seiten` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `url` varchar(1000) DEFAULT NULL,
  `sucher` int(5) DEFAULT NULL,
  `viewDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Daten für Tabelle `seiten`
--

INSERT INTO `seiten` (`id`, `url`, `sucher`, `viewDate`) VALUES
(1, 'http://www.wikipedia.com', 1, '2014-01-24 10:43:40'),
(2, 'http://www.jidsfdisf.de', 2, '2014-01-30 09:27:03'),
(3, 'http://doncare.com', 4, '2014-01-30 12:45:57');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `woerter`
--

CREATE TABLE IF NOT EXISTS `woerter` (
  `wort` varchar(50) CHARACTER SET latin1 NOT NULL,
  `link` varchar(10000) CHARACTER SET latin1 NOT NULL,
  `aufrufe` int(10) DEFAULT '0',
  `anzeige` int(1) DEFAULT '1',
  PRIMARY KEY (`wort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
