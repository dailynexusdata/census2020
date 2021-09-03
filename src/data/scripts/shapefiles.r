setwd("C:/nexus/data-gh/census/src/data")
library(tidyverse)
library(sf)

#
# 2010 Census Block Group Map
#
cbg.map.2010 <- read_sf("tl_2010_06083_bg10/tl_2010_06083_bg10.shp")

sb.2010 <- cbg.map.2010 %>%
  filter(COUNTYFP10 == "083") %>%
  filter(ALAND10 > 0)

plot(st_geometry(sb.2010), col = sf.colors(12, categorical = TRUE))

sb.2010 %>%
  st_write("sb2010/sb2010.shp")

#
# Census Block Group Map:
#
cbg.map.2020 <- read_sf("tl_2020_06_bg/tl_2020_06_bg.shp")

sb.2020 <- cbg.map.2020 %>%
  filter(COUNTYFP == "083") %>%
  filter(ALAND > 0) # removes ocean buffer

# Color by TRACT
sb.2020 %>%
  group_by(TRACTCE) %>%
  summarise(geometry = sf::st_union(geometry)) %>%
  ungroup() %>%
  plot(st_geometry(.))

plot(st_geometry(sb.2020), col = sf.colors(12, categorical = TRUE))

# Filter out Tracts for IV + Goleta + University
tracts <- c(
  "002933","002936","002937","980300","002933","002933","002936",
  "002935","002937","002935","002924","002924","002926","002926",
  "002924","002924","002926"
)

iv.2020 <- sb.2020 %>%
  filter(TRACTCE %in% (tracts)) %>%
  filter(!(GEOID == "060830029331"))

plot(st_geometry(iv.2020), col = sf.colors(12, categorical = TRUE))

iv.2020 %>%
  st_write("iv2020.shp")
# this is then converted to GEOJson format using https://mapshaper.org/
# then the geometry orientation has to be reversed using the node script in scripts/

#
# IV 2010
#
tracts10 <- c("002924", "002926", "002922", "002928", "002915")
geoid10 <- c("060830029151005","060830029305009","060830029305008","060830029151003","060830029305003","060830029305007","060830029305010","060830029151005","060830029305002","060830029305001","060830029305011","060830029151005","060830029304", "060830029306", "060830029303", "060830029305", "060830029306003","060830029305005","060830029305006","060830029305004")

iv.2010 <- sb.2010 %>%
  filter((TRACTCE10 %in% tracts10) | (GEOID10 %in% geoid10))

iv.2010 %>%
  st_write("iv2010.shp")
    
plot(st_geometry(iv.2010), col = sf.colors(12, categorical = TRUE))

#
# Census Blocks
#
blocks <- read_sf("blocks/tl_2020_06_tabblock20.shp")
iv.blocks <- blocks %>%
  filter(TRACTCE20 %in% tracts) %>%
  filter(COUNTYFP20 == "083") %>%
  filter(ALAND20 > 0) %>%
  filter(!(GEOID20 %in% c(
    "060830029333002",
    "060830029333002",
    "060830029333000",
    "060830029352001",
    "060830029352000",
    "060830029352009",
    "060830029352008",
    "060830029352011",
    "060830029352002",
    "060830029352007",
    "060830029352012",
    "060830029352006",
    "060830029352003",
    "060830029352004",
    "060830029351000",
    "060830029351001",
    "060830029351002",
    "060830029351003",
    "060830029351004",
    "060830029352010",
    "060830029352016"
  ))) %>%
  filter(as.numeric(str_replace(INTPTLAT20, "\\+", "")) <= 34.4262757) %>% # filter out north of Goleta part
  mutate(
    city = ifelse(
      TRACTCE20 %in% c(
        "002936", "002926", "002924"
      ),
      "iv",
      ifelse(
        (GEOID20 %in% c(
          "060830029332000",
          "060830029334000",
          "060830029334001",
          "060830029334002",
          "060830029334003",
          "060830029334004",
          "060830029334005",
          "060830029334006",
          "060830029334007",
          "060830029334008",
          "060830029332001",
          "060830029332002",
          "060830029333013",
          "060830029372015",
          "060830029372017",
          "060830029332003",
          "060830029332002",
          "060830029332001",
          "060830029372016",
          "060830029372007",
          "060830029372008",
          "060830029372009",
          "060830029372010",
          "060830029371001",
          "060830029371000",
          "060830029371002"
        )) | (TRACTCE20 %in% c("980300")) ,
        "ucsb",
        "goleta"
      )
    )
  )
plot(st_geometry(iv.blocks), col = sf.colors(12, categorical = TRUE))

# exported and then converted using the same steps as above
iv.blocks %>%
  st_write("ivblocks.shp")


#
# Census Blocks 2010
#
blocks.10 <- read_sf("tl_2010_06083_tabblock10/tl_2010_06083_tabblock10.shp")
iv.blocks.2010 <- blocks.10 %>%
  filter((TRACTCE10 %in% tracts10) | (GEOID10 %in% geoid10)) %>%
  filter(COUNTYFP10 == "083") %>%
  filter(as.numeric(str_replace(INTPTLAT10, "\\+", "")) <= 34.4302757) %>% # filter out north of Goleta part
  filter(!(GEOID10 %in% c("060830029221009", "060830029223000", "060830029224016", "060830029224021", "060830029224013", "060830029151006", "060830029281003"))) %>%
  mutate(
    city = ifelse(
        GEOID10 %in% c('060830029281002',
                       '060830029151009',
                       '060830029151008',
                       '060830029151007',
                       '060830029151010',
                       '060830029151011',
                       '060830029222000',
                       '060830029225000',
                       '060830029221000',
                       '060830029223001',
                       '060830029221001',
                       '060830029225005',
                       '060830029225008',
                       '060830029225007',
                       '060830029225004',
                       '060830029221007',
                       '060830029225010',
                       '060830029225006',
                       '060830029221006',
                       '060830029225003',
                       '060830029225002',
                       '060830029225009',
                       '060830029225000',
                       '060830029221008',
                       '060830029221003',
                       '060830029221004',
                       '060830029221005',
                       '060830029221002',
                       '060830029225001',
                       '060830029281001'),
      "sb",
      ifelse(
        (TRACTCE10 %in% c('002936', '002926', '002924')),
        "iv",
        ifelse(
          GEOID10 %in% c('060830029281002', '060830029281001', '060830029281005'),
          "goleta",
          ifelse(
            TRACTCE10 == '002928',
            "iv",
            "goleta"
          )
        )
      )
    )
  )

plot(st_geometry(iv.blocks.2010), col = sf.colors(12, categorical = TRUE))

iv.blocks.2010 %>%
  st_write("ivblocks2010.shp")

paste(iv.blocks$GEOID20, collapse="','")
paste(iv.blocks.2010$GEOID10, collapse="','")

iv.blocks.2010 %>%
  select(TRACTCE10, BLOCKCE10, GEOID10, NAME10) %>%
  filter(TRACTCE10 == "002915")

#
# Census Data
#

# change the perl extension to csv
ca.2010.part1 <- read.csv("ca2010.pl/ca000012010.csv", header=F)

cnames <- c("LENGTH FILEID",
            "STUSAB",
            "CHARITER",
            "CIFSN",
            "LOGRECNO",
            "P0010001",
            "P0010002",
            "P0010003",
            "P0010004",
            "P0010005",
            "P0010006",
            "P0010007",
            "P0010008",
            "P0010009",
            "P0010010",
            "P0010011",
            "P0010012",
            "P0010013",
            "P0010014",
            "P0010015",
            "P0010016",
            "P0010017",
            "P0010018",
            "P0010019",
            "P0010020",
            "P0010021",
            "P0010022",
            "P0010023",
            "P0010024",
            "P0010025",
            "P0010026",
            "P0010027",
            "P0010028",
            "P0010029",
            "P0010030",
            "P0010031",
            "P0010032",
            "P0010033",
            "P0010034",
            "P0010035",
            "P0010036",
            "P0010037",
            "P0010038",
            "P0010039",
            "P0010040",
            "P0010041",
            "P0010042",
            "P0010043",
            "P0010044",
            "P0010045",
            "P0010046",
            "P0010047",
            "P0010048",
            "P0010049",
            "P0010050",
            "P0010051",
            "P0010052",
            "P0010053",
            "P0010054",
            "P0010055",
            "P0010056",
            "P0010057",
            "P0010058",
            "P0010059",
            "P0010060",
            "P0010061",
            "P0010062",
            "P0010063",
            "P0010064",
            "P0010065",
            "P0010066",
            "P0010067",
            "P0010068",
            "P0010069",
            "P0010070",
            "P0010071",
            "P0020001",
            "P0020002",
            "P0020003",
            "P0020004",
            "P0020005",
            "P0020006",
            "P0020007",
            "P0020008",
            "P0020009",
            "P0020010",
            "P0020011",
            "P0020012",
            "P0020013",
            "P0020014",
            "P0020015",
            "P0020016",
            "P0020017",
            "P0020018",
            "P0020019",
            "P0020020",
            "P0020021",
            "P0020022",
            "P0020023",
            "P0020024",
            "P0020025",
            "P0020026",
            "P0020027",
            "P0020028",
            "P0020029",
            "P0020030",
            "P0020031",
            "P0020032",
            "P0020033",
            "P0020034",
            "P0020035",
            "P0020036",
            "P0020037",
            "P0020038",
            "P0020039",
            "P0020040",
            "P0020041",
            "P0020042",
            "P0020043",
            "P0020044",
            "P0020045",
            "P0020046",
            "P0020047",
            "P0020048",
            "P0020049",
            "P0020050",
            "P0020051",
            "P0020052",
            "P0020053",
            "P0020054",
            "P0020055",
            "P0020056",
            "P0020057",
            "P0020058",
            "P0020059",
            "P0020060",
            "P0020061",
            "P0020062",
            "P0020063",
            "P0020064",
            "P0020065",
            "P0020066",
            "P0020067",
            "P0020068",
            "P0020069",
            "P0020070",
            "P0020071",
            "P0020072",
            "P0020073")
colnames(ca.2010.part1) <- cnames

logrecno.bgs.2010 <- data.frame(
  id=c(891255,891256,891257,891258,891259,891260,891261,891262,891275,891276,891277,891278,891280,891281,891282,891283,891284,891285,891286,891287,891288,891289,891290,891291,891293,891294,891295,891296,891297,891298,891300,891301,891302,891303,891304,891305,891306,891307,891308,891311,891312,891314,891315,891316,891317,891318,891320,891323,891324,891325,891326,891327,891328,891329,891331,891332,891411,891412,891413,891418,891419,891420,891421,891423,891424,891425,891426,891427,891428,891429,891430,891468,891469,891470,891471,891472,891473,891474,891475,891476,891477,891478,891483,891500,891502,891505,891507,891508,891509,891510,891511,891512,891513,891514,891515,891516,891517,891828,891829,891830,891831,891832,891833,891836,891837,891838,891840,891841,891842,891843,891844,891845,891846,891847,891848,891852,891853,891854),
  geoid=c('060830029221001','060830029221002','060830029221003','060830029221004','060830029221005','060830029221006','060830029221007','060830029221008','060830029241000','060830029241001','060830029241002','060830029241003','060830029242000','060830029242001','060830029242002','060830029242003','060830029242004','060830029242005','060830029242006','060830029242007','060830029242008','060830029242009','060830029242010','060830029242011','060830029243000','060830029243001','060830029243002','060830029243003','060830029243004','060830029243005','060830029244000','060830029244001','060830029244002','060830029244003','060830029244004','060830029244005','060830029244006','060830029244007','060830029244008','060830029261000','060830029261001','060830029262000','060830029262001','060830029262002','060830029262003','060830029262004','060830029263000','060830029281011','060830029281012','060830029281013','060830029281014','060830029281017','060830029281018','060830029281019','060830029282000','060830029282001','060830029151000','060830029151002','060830029151005','060830029224017','060830029224018','060830029224019','060830029224020','060830029224024','060830029224025','060830029224026','060830029224027','060830029224028','060830029224029','060830029224030','060830029224031','060830029305001','060830029305002','060830029305003','060830029305004','060830029305005','060830029305006','060830029305007','060830029305008','060830029305009','060830029305010','060830029305011','060830029306003','060830029221000','060830029222000','060830029223001','060830029225000','060830029225001','060830029225002','060830029225003','060830029225004','060830029225005','060830029225006','060830029225007','060830029225008','060830029225009','060830029225010','060830029151007','060830029151008','060830029151009','060830029151010','060830029151011','060830029151012','060830029281000','060830029281001','060830029281002','060830029281004','060830029281005','060830029281006','060830029281007','060830029281008','060830029281009','060830029281010','060830029281015','060830029281016','060830029151001','060830029151003','060830029151004')
)

sb.county.2010 <- ca.2010.part1 %>%
  filter(LOGRECNO == 884835)

sb.county.2010 %>%
  mutate(
    white=P0010003,
    black=P0010004,
    asian=P0010006,
    other=P0010008,
    his=P0020002, 
    nothis=P0020003
  ) %>%
  summarise(
    white = sum(white)/sum(P0010001),
    black = sum(black)/sum(P0010001),
    asian = sum(asian)/sum(P0010001),
    other = sum(other)/sum(P0010001),
    his = sum(his)/sum(P0020001),
    nothis = sum(nothis)/sum(P0020001)
  ) %>%
  mutate(
    more2 = 1 - white - black - asian - other
  )

ivData.p1 <- ca.2010.part1 %>%
  filter(LOGRECNO %in% logrecno.bgs.2010$id) %>%
  left_join(
    logrecno.bgs.2010,
    by=c("LOGRECNO"="id")
  ) %>%
  left_join(
    iv.blocks.2010 %>% as_tibble() %>% select(GEOID10, city),
    by=c("geoid"="GEOID10")
  )

ivData.p1 %>%
  group_by(city) %>%
  summarise(totpop=sum(P0010001))

ivData.p1 %>%
  group_by(city) %>%
  summarise(
    
  )

ivData.p1 %>% summarise(pct = sum((P0010003 + P0010004 + P0010006 + P0010008))/sum(P0010001))

ivData.p1 %>%
  mutate(
    white=P0010003,
    black=P0010004,
    asian=P0010006,
    other=P0010008
  ) %>%
  filter(city != "goleta") %>%
#  group_by(city) %>%
  summarise(
    white = sum(white)/sum(P0010001),
    black = sum(black)/sum(P0010001),
    asian = sum(asian)/sum(P0010001),
    other = sum(other)/sum(P0010001),
  )
  

ivData.p1 %>%
  mutate(
    white=P0010003/P0010001*100,
    black=P0010004/P0010001*100,
    asian=P0010006/P0010001*100,
    other=(P0010008+P0010007+P0010005)/P0010001*100
  ) %>%
  select(
    fips=geoid, 
    city,
    pop=P0010001,
    white,
    black,
    asian,
    other
  ) %>%
  write.csv("../../dist/data/ivDataP1.csv", row.names = F)

ivData.p1%>%
  mutate(his=P0020002, nothis=P0020003, white=P0010003)%>%
  filter(city != "goleta") %>%
  #  group_by(city) %>%
  summarise(
    white = sum(white)/sum(P0010001),
    his = sum(his)/sum(P0020001),
    nothis = sum(nothis)/sum(P0020001)
  )


#
# 2020 data
#

bgdata <- read.csv("ca2020.pl/cageo2020.pl", sep="|")

colnames(bgdata)[8] <- "logrec"
colnames(bgdata)[10] <- "geoid"
colnames(bgdata)[15] <- "county"
colnames(bgdata)[33] <- "tract"
colnames(bgdata)[34] <- "bg"
colnames(bgdata)[35] <- "block"

countyLogRec <- bgdata %>%
  filter(geoid == "06083") %>%
  pull(logrec)

bgvals.p1 <- read.csv("ca2020.pl/ca000012020.pl", sep="|")
colnames(bgvals.p1) <- cnames


ivdata <- bgdata %>% 
  filter(county == 83) %>%
  filter(!is.na(block)) %>%
  select(logrec, geoid) %>%
  inner_join(
    iv.blocks %>%
      as_tibble() %>%
      mutate(grouping = paste("06083", TRACTCE20, BLOCKCE20, sep="")) %>%
      select(grouping, city),
    by=c("geoid"="grouping")
  ) %>%
  left_join(
    bgvals.p1,
    by=c("logrec"="LOGRECNO")
  )


ivdata %>%
  mutate(
    white=P0010003/P0010001*100,
    black=P0010004/P0010001*100,
    asian=P0010006/P0010001*100,
    other=(P0010008+P0010007+P0010005)/P0010001*100,
    hisp=P0020002/P0020001*100
  ) %>%
  select(
    fips=geoid, 
    city,
    pop=P0010001,
    white,
    black,
    asian,
    other,
    hisp
  ) %>%
  write.csv("../../dist/data/ivData2020P1.csv", row.names = F)

ivdata %>% group_by(city) %>% summarise(s = sum(P0010001))
ivData.p1 %>% group_by(city) %>% summarise(s = sum(P0010001))


ivdata %>% filter(city != "goleta") %>% summarise(s = sum(P0010001))
ivData.p1 %>% filter(city != "goleta") %>% summarise(s = sum(P0010001))

# num students enrolled 2009-10, 2019-2020 spring quarter
c(21117, 24432)

ivdata%>%
  mutate(
    white=P0010003,
    black=P0010004,
    asian=P0010006,
    other=P0010008
  ) %>%
  filter(city == "iv") %>%
#  group_by(city) %>%
  summarise(
    white = sum(white)/sum(P0010001),
    black = sum(black)/sum(P0010001),
    asian = sum(asian)/sum(P0010001),
    other = sum(other)/sum(P0010001),
    hisp=sum(P0020002)/sum(P0020001)
  ) %>%
  mutate(
    more2 = 1 - white - black - asian - other,
    nhisp = 1 - hisp
  ) %>%
  select(
    white, asian, black, other, more2, hisp, nhisp
  ) %>%
  gather(key="race", value="pct") %>%
  mutate(
    start = c(0, cumsum(pct)[-length(pct)]),
    end = c(cumsum(pct))
  )

ivdata %>%
  select(city) %>%
  unique()

bgvals.p1 %>%
  filter(LOGRECNO == countyLogRec) %>%
  mutate(
    white=P0010003,
    black=P0010004,
    asian=P0010006,
    other=P0010008,
    his=P0020002,
    nothis=P0020003
  ) %>%
  summarise(
    white = sum(white)/sum(P0010001),
    black = sum(black)/sum(P0010001),
    asian = sum(asian)/sum(P0010001),
    other = sum(other)/sum(P0010001),
    his = sum(his)/sum(P0020001),
    nothis = sum(nothis)/sum(P0020001)
  ) %>%
  mutate(
    more2 = 1 - white - black - asian - other
  )

ivdata %>%
  mutate(his=P0020002, nothis=P0020003, white=P0010003)%>%
  filter(city != "goleta") %>%
  group_by(city) %>%
  summarise(
    white = sum(white)/sum(P0010001),
    his = sum(his)/sum(P0020001),
    nothis = sum(nothis)/sum(P0020001)
  )




# -----------------------------
# Specify path to part 3 file
# -----------------------------
part3_file_path <- "ca2020.pl/ca000032020.pl"

# -----------------------------
# Import the data
# -----------------------------
part3  <- read.delim(part3_file_path, header=FALSE, colClasses="character", sep="|")

# -----------------------------
# Assign names to data columns:
# -----------------------------
#  FILEID   File Identification
#  STUSAB   State/US-Abbreviation (USPS)
#  CHARITER Characteristic Iteration
#  CIFSN    Characteristic Iteration File Sequence Number
#  LOGRECNO Logical Record Number
#  P0050001 Total:
#  P0050002 Institutionalized population:
#  P0050003 Correctional facilities for adults
#  P0050004 Juvenile facilities
#  P0050005 Nursing facilities/Skilled-nursing facilities
#  P0050006 Other institutional facilities
#  P0050007 Noninstitutionalized population:
#  P0050008 College/University student housing
#  P0050009 Military quarters
#  P0050010 Other noninstitutional facilities
# -----------------------------
colnames(part3) <- c("FILEID", "STUSAB", "CHARITER", "CIFSN", "LOGRECNO",
                     paste0("P00", 50001:50010))

iv3 <- part3 %>%
  mutate(LOGRECNO=as.numeric(LOGRECNO)) %>%
  right_join(
    ivdata,
    by=c("LOGRECNO"="logrec")
  ) 

iv3 %>%
  filter(city != "goleta")%>%
  summarise(n=sum(as.numeric(P0050008)))

iv3


# -----------------------------
# Specify path to part 2 file
# -----------------------------
part2_file_path <- "ca2020.pl/ca000022020.pl"

# -----------------------------
# Import the data
# -----------------------------
part2  <- read.delim(part2_file_path, header=FALSE, colClasses="character", sep="|")

# -----------------------------
# Assign names to data columns:
# -----------------------------
#  FILEID    File Identification
#  STUSAB    State/US-Abbreviation (USPS)
#  CHARITER  Characteristic Iteration
#  CIFSN     Characteristic Iteration File Sequence Number
#  LOGRECNO  Logical Record Number
#  P0030001  P3-1: Total
#  P0030002  P3-2: Population of one race
#  P0030003  P3-3: White alone
#  P0030004  P3-4: Black or African American alone
#  P0030005  P3-5: American Indian and Alaska Native alone
#  P0030006  P3-6: Asian alone
#  P0030007  P3-7: Native Hawaiian and Other Pacific Islander alone
#  P0030008  P3-8: Some other race alone
#  P0030009  P3-9: Population of two or more races
#  P0030010  P3-10: Population of two races
#  P0030011  P3-11: White; Black or African American
#  P0030012  P3-12: White; American Indian and Alaska Native
#  P0030013  P3-13: White; Asian
#  P0030014  P3-14: White; Native Hawaiian and Other Pacific Islander
#  P0030015  P3-15: White; Some other race
#  P0030016  P3-16: Black or African American; American Indian and Alaska Native
#  P0030017  P3-17: Black or African American; Asian
#  P0030018  P3-18: Black or African American; Native Hawaiian and Other Pacific Islander
#  P0030019  P3-19: Black or African American; Some other race
#  P0030020  P3-20: American Indian and Alaska Native; Asian
#  P0030021  P3-21: American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander
#  P0030022  P3-22: American Indian and Alaska Native; Some other race
#  P0030023  P3-23: Asian; Native Hawaiian and Other Pacific Islander
#  P0030024  P3-24: Asian; Some other race
#  P0030025  P3-25: Native Hawaiian and Other Pacific Islander; Some other race
#  P0030026  P3-26: Population of three races
#  P0030027  P3-27: White; Black or African American; American Indian and Alaska Native
#  P0030028  P3-28: White; Black or African American; Asian
#  P0030029  P3-29: White; Black or African American; Native Hawaiian and Other Pacific Islander
#  P0030030  P3-30: White; Black or African American; Some other race
#  P0030031  P3-31: White; American Indian and Alaska Native; Asian
#  P0030032  P3-32: White; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander
#  P0030033  P3-33: White; American Indian and Alaska Native; Some other race
#  P0030034  P3-34: White; Asian; Native Hawaiian and Other Pacific Islander
#  P0030035  P3-35: White; Asian; Some other race
#  P0030036  P3-36: White; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030037  P3-37: Black or African American; American Indian and Alaska Native; Asian
#  P0030038  P3-38: Black or African American; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander
#  P0030039  P3-39: Black or African American; American Indian and Alaska Native; Some other race
#  P0030040  P3-40: Black or African American; Asian; Native Hawaiian and Other Pacific Islander
#  P0030041  P3-41: Black or African American; Asian; Some other race
#  P0030042  P3-42: Black or African American; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030043  P3-43: American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander
#  P0030044  P3-44: American Indian and Alaska Native; Asian; Some other race
#  P0030045  P3-45: American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030046  P3-46: Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030047  P3-47: Population of four races
#  P0030048  P3-48: White; Black or African American; American Indian and Alaska Native; Asian
#  P0030049  P3-49: White; Black or African American; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander
#  P0030050  P3-50: White; Black or African American; American Indian and Alaska Native; Some other race
#  P0030051  P3-51: White; Black or African American; Asian; Native Hawaiian and Other Pacific Islander
#  P0030052  P3-52: White; Black or African American; Asian; Some other race
#  P0030053  P3-53: White; Black or African American; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030054  P3-54: White; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander
#  P0030055  P3-55: White; American Indian and Alaska Native; Asian; Some other race
#  P0030056  P3-56: White; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030057  P3-57: White; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030058  P3-58: Black or African American; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander
#  P0030059  P3-59: Black or African American; American Indian and Alaska Native; Asian; Some other race
#  P0030060  P3-60: Black or African American; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030061  P3-61: Black or African American; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030062  P3-62: American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030063  P3-63: Population of five races
#  P0030064  P3-64: White; Black or African American; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander
#  P0030065  P3-65: White; Black or African American; American Indian and Alaska Native; Asian; Some other race
#  P0030066  P3-66: White; Black or African American; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030067  P3-67: White; Black or African American; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030068  P3-68: White; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030069  P3-69: Black or African American; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0030070  P3-70: Population of six races
#  P0030071  P3-71: White; Black or African American; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040001  P4-1: Total
#  P0040002  P4-2: Hispanic or Latino
#  P0040003  P4-3: Not Hispanic or Latino
#  P0040004  P4-4: Population of one race
#  P0040005  P4-5: White alone
#  P0040006  P4-6: Black or African American alone
#  P0040007  P4-7: American Indian and Alaska Native alone
#  P0040008  P4-8: Asian alone
#  P0040009  P4-9: Native Hawaiian and Other Pacific Islander alone
#  P0040010  P4-10: Some other race alone
#  P0040011  P4-11: Population of two or more races
#  P0040012  P4-12: Population of two races
#  P0040013  P4-13: White; Black or African American
#  P0040014  P4-14: White; American Indian and Alaska Native
#  P0040015  P4-15: White; Asian
#  P0040016  P4-16: White; Native Hawaiian and Other Pacific Islander
#  P0040017  P4-17: White; Some other race
#  P0040018  P4-18: Black or African American; American Indian and Alaska Native
#  P0040019  P4-19: Black or African American; Asian
#  P0040020  P4-20: Black or African American; Native Hawaiian and Other Pacific Islander
#  P0040021  P4-21: Black or African American; Some other race
#  P0040022  P4-22: American Indian and Alaska Native; Asian
#  P0040023  P4-23: American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander
#  P0040024  P4-24: American Indian and Alaska Native; Some other race
#  P0040025  P4-25: Asian; Native Hawaiian and Other Pacific Islander
#  P0040026  P4-26: Asian; Some other race
#  P0040027  P4-27: Native Hawaiian and Other Pacific Islander; Some other race
#  P0040028  P4-28: Population of three races
#  P0040029  P4-29: White; Black or African American; American Indian and Alaska Native
#  P0040030  P4-30: White; Black or African American; Asian
#  P0040031  P4-31: White; Black or African American; Native Hawaiian and Other Pacific Islander
#  P0040032  P4-32: White; Black or African American; Some other race
#  P0040033  P4-33: White; American Indian and Alaska Native; Asian
#  P0040034  P4-34: White; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander
#  P0040035  P4-35: White; American Indian and Alaska Native; Some other race
#  P0040036  P4-36: White; Asian; Native Hawaiian and Other Pacific Islander
#  P0040037  P4-37: White; Asian; Some other race
#  P0040038  P4-38: White; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040039  P4-39: Black or African American; American Indian and Alaska Native; Asian
#  P0040040  P4-40: Black or African American; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander
#  P0040041  P4-41: Black or African American; American Indian and Alaska Native; Some other race
#  P0040042  P4-42: Black or African American; Asian; Native Hawaiian and Other Pacific Islander
#  P0040043  P4-43: Black or African American; Asian; Some other race
#  P0040044  P4-44: Black or African American; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040045  P4-45: American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander
#  P0040046  P4-46: American Indian and Alaska Native; Asian; Some other race
#  P0040047  P4-47: American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040048  P4-48: Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040049  P4-49: Population of four races
#  P0040050  P4-50: White; Black or African American; American Indian and Alaska Native; Asian
#  P0040051  P4-51: White; Black or African American; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander
#  P0040052  P4-52: White; Black or African American; American Indian and Alaska Native; Some other race
#  P0040053  P4-53: White; Black or African American; Asian; Native Hawaiian and Other Pacific Islander
#  P0040054  P4-54: White; Black or African American; Asian; Some other race
#  P0040055  P4-55: White; Black or African American; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040056  P4-56: White; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander
#  P0040057  P4-57: White; American Indian and Alaska Native; Asian; Some other race
#  P0040058  P4-58: White; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040059  P4-59: White; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040060  P4-60: Black or African American; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander
#  P0040061  P4-61: Black or African American; American Indian and Alaska Native; Asian; Some other race
#  P0040062  P4-62: Black or African American; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040063  P4-63: Black or African American; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040064  P4-64: American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040065  P4-65: Population of five races
#  P0040066  P4-66: White; Black or African American; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander
#  P0040067  P4-67: White; Black or African American; American Indian and Alaska Native; Asian; Some other race
#  P0040068  P4-68: White; Black or African American; American Indian and Alaska Native; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040069  P4-69: White; Black or African American; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040070  P4-70: White; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040071  P4-71: Black or African American; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  P0040072  P4-72: Population of six races
#  P0040073  P4-73: White; Black or African American; American Indian and Alaska Native; Asian; Native Hawaiian and Other Pacific Islander; Some other race
#  H0010001  H1-1: Total
#  H0010002  H1-2: Occupied
#  H0010003  H1-3: Vacant
# -----------------------------
colnames(part2) <- c("FILEID", "STUSAB", "CHARITER", "CIFSN", "LOGRECNO", 
                     paste0("P00", c(30001:30071, 40001:40073)), 
                     paste0("H00", 10001:10003))
iv2 <- part2 %>%
  mutate(LOGRECNO=as.numeric(LOGRECNO)) %>%
  right_join(
    ivdata,
    by=c("LOGRECNO"="logrec")
  ) 

iv2 %>%
  filter(city != "goleta") %>%
  group_by(city) %>%
  summarise(
    totHousing = sum(as.numeric(H0010001)),
    pctOc = sum(as.numeric(H0010002))/sum(as.numeric(H0010001)),
    pctNOc = sum(as.numeric(H0010003))/sum(as.numeric(H0010001))
  )
