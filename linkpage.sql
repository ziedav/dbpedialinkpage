-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 30. Jan 2014 um 13:55
-- Server Version: 5.6.14
-- PHP-Version: 5.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Daten für Tabelle `personen`
--

INSERT INTO `personen` (`id`, `vorname`, `nachname`, `benutzer`, `passwort`, `email`, `isAdmin`, `createDate`) VALUES
(3, 'David', 'Ziemann', 'ziedav', '1af35e2d8e96fd078e05ad82d7bddecd', 'david.ziemann@gmail.com', 0, '2014-01-30'),
(4, 'Tim', 'Wehr', 'wehrtim', '50dfb46c91869d827839fd4a1107fd36', 'tim.wehr@hatkeinemail.de', 0, '2014-01-30');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

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
  `wort` varchar(50) NOT NULL,
  `link` varchar(10000) NOT NULL,
  `aufrufe` int(10) DEFAULT '0',
  `anzeige` int(1) DEFAULT '1',
  PRIMARY KEY (`wort`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `woerter`
--

INSERT INTO `woerter` (`wort`, `link`, `aufrufe`, `anzeige`) VALUES
('Test', 'http://de.wikipedia.org/Test', 10, 0),
('Tim', 'http://www.tim.de', 3, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
