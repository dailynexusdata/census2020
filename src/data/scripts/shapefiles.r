setwd("C:/nexus/data-gh/census/src/data")
library(tidyverse)
library(sf)

sb.map.2010 <- read_sf("tl_2010_06083_bg10/tl_2010_06083_bg10.shp")

sb.2010 <- sb.map.2010 %>%
  filter(ALAND10 > 0) # %>%
  # filter(GEOID10=="060830001032")

plot(st_geometry(sb.2010), col = sf.colors(12, categorical = TRUE))

cbg.map.2020 <- read_sf("tl_2020_06_bg/tl_2020_06_bg.shp")

sb.2020 <- cbg.map.2020 %>%
  filter(COUNTYFP == "083") %>%
  filter(ALAND > 0)# %>%
#  filter(GEOID=="060830001032")

plot(st_geometry(sb.2020), col = sf.colors(12, categorical = TRUE))

tracts <- c(
  "002933","002936","002937","980300","002933","002933","002936",
  "002935","002937","002935","002924","002924","002926","002926",
  "002924","002924","002926"
)

iv.2020 <- sb.2020 %>%
  filter(TRACTCE %in% (tracts)) %>%
  filter(!(GEOID == "060830029331"))

iv.2020

paste(iv.2020$TRACTCE, iv.2020$BLKGRPCE, sep="")

plot(st_geometry(iv.2020), col = sf.colors(12, categorical = TRUE))


iv.2020 %>%
  st_write("iv2020.shp")


blocks <- read_sf("blocks/tl_2020_06_tabblock20.shp")
iv.blocks <- blocks %>%
  filter(TRACTCE20 %in% tracts)

iv.blocks %>%
  st_write("ivblocks.shp")

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

ivData.p1 <- ca.2010.part1 %>%
  filter(LOGRECNO %in% as.numeric(tracts))

as.numeric(tracts)

ivData.p1 %>%
  select(fips=LOGRECNO, pop=P0010001) %>%
  write.csv("../../dist/data/ivDataP1.csv", row.names = F)



length(ivData.p1$LOGRECNO)

str(ca.2010.part1)

sb.2010 %>%
  as_tibble() %>%
  select(GEOID=GEOID10,ALAND=ALAND10)

bind_rows(
  sb.2020 %>%
    as_tibble() %>%
    mutate(which="2020") %>%
    select(GEOID, ALAND=ALAND, which),
  sb.2010 %>%
    as_tibble() %>%
    mutate(which="2010") %>%
    select(GEOID=GEOID10,ALAND=ALAND10, which)
) %>%
  spread(which, ALAND) %>%
  mutate(diff = `2020` - `2010`)
