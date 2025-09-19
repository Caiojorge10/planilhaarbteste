PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Casa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "licenca" TEXT,
    "avaliacao" REAL,
    "status" TEXT NOT NULL DEFAULT 'ativa',
    "bonusBoasVindas" TEXT,
    "bonusRecarga" TEXT,
    "tempoSaque" TEXT,
    "metodosPagamento" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "site" TEXT,
    "observacoes" TEXT,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Casa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Casa VALUES(1,'Multibet','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(2,'Pixbet','brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(3,'Betão','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(4,'Brasil da sorte','Ativa','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(5,'Bet365','Ativa','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(6,'Betbra Exchange','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(7,'Pagolbet','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(8,'4Play','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(9,'Bolsa de aposta Exchange','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(10,'Cassinobet','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(11,'7Kbet','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(12,'Verabet','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(13,'7games','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(14,'Stake','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(15,'Estrelabet','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(16,'Betfast','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(17,'Betpix','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(18,'Vaidebet','Brasil','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(19,'Rei do pitaco','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(20,'Betnacional','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(21,'Papigames','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(22,'R7games','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(23,'Hiperbet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(24,'Betdasorte','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(25,'Sortenabet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(26,'Realsbet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(27,'Lotogreen','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(28,'KTO','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(29,'Mcgames','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(30,'Betesporte','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(31,'Bullsbet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(32,'Luvabet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(33,'MMAbet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(34,'Fullbet Exchange','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(35,'Esportivabet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(36,'Apostatudo','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(37,'Pinnacle','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(38,'F12','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(39,'Betvip','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(40,'Esportedasorte','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(41,'Segurobet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(42,'Jogodeouro','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(43,'Ux','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(44,'Superbet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(45,'Onabet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(46,'Esportivabet','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(47,'Alfabet','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(48,'Pinnacle','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(49,'Betano','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(50,'Alfabet Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(51,'Alfabet Beatriz','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(52,'Alfabet Pai','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(59,'Bets comum','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(60,'Betfast Beatriz','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(61,'Betfast Felipe','b','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(62,'Betfast Pai','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(63,'Multibet Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(64,'7kbet Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(65,'KTO Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(66,'Hiperbet Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(67,'Esportivabet Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(68,'Betesporte Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(69,'F12 Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(70,'Betnacional Felipe','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(71,'Suprema bet','B','',0.0,'ativa','','','','','','','','',1);
INSERT INTO Casa VALUES(72,'Mcgames Beatriz','B','',0.0,'ativa','','','','','','','','',1);
COMMIT;
