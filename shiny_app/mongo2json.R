library(mongolite)
library(tidyverse)
library(jsonlite)

options(mongo_password = "")
mongo_user <- "NiCl2"
mongo_collection <- "article_scores1"
mongo_database <- "article_scores"
mongo_cluster <- "sciathon"
data_colnames <- c("url", "score", "evidence", "when", "bias", "clear", "uncertainty")

load_data <- function() {
  db = mongo(collection = mongo_collection,
                   url = paste0("mongodb+srv://",
                                mongo_user,
                                ":",
                                options()$mongo_password,
                                "@",
                                mongo_cluster,
                                "-a2eyh.gcp.mongodb.net/",
                                mongo_database,
                                "?retryWrites=true&w=majority")
  )
  data = db$find()
  data[, 2:ncol(data)] <- sapply(data[, 2:ncol(data)], as.numeric)
  data
}

mongo_dat <- load_data()

# summarise if same website/V1 name
db_sum <- db_clean %>% mutate(V1=gsub("(^http://)|(^https://)|(/$)","",V1),
                              V1=ifelse(!grepl("^www\\.",V1),paste0("www.",V1),V1)) %>%
  group_by(V1) %>% summarise(V2median=median(V2),n=n(),V2sd=sd(V2)) %>%
  mutate(V2=V2median*10,V2median=ceiling(V2median)) %>% select(-V2median) %>%
  mutate(nsep=str_count(V1,"/")) %>%
  arrange(desc(nsep))

#Output
# alter to prep files in desired format
db_out <- db_sum %>% select(V1,V2)

# Creating info JSON
json_content <- paste0("{\n")
for (i in 1:length(db_out$V1)){
  cat(paste0("\"", db_out$V1[[i]], "\" : ", db_out$V2[[i]]), ",\n")
  json_content <- paste0(json_content, paste0("\"", db_out$V1[[i]], "\" : ", db_out$V2[[i]], ",\n"))
}
json_content <- paste0(json_content, "}\n")
fileConn <- file("info.json")
writeLines(json_content, fileConn)
close(fileConn)
