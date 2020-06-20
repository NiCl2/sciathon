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

# normalise to wwww
mongo_dat <- mongo_dat %>% mutate(url=gsub("(^http://)|(^https://)|(/$)","",url),
                              url=ifelse(!grepl("^www\\.",url),paste0("www.",url),url))

mongo_dat <- group_by(mongo_dat, url) %>% mutate(n_ratings = n()) 
# summarise if same article
summarised_dat <- summarise_at(mongo_dat, c("n_ratings", data_colnames[2:length(data_colnames)]), ~ ceiling(mean(.x, na.rm = T)))

# Creating info JSON
json_content <- paste0("{\n")
for (i in 1:nrow(summarised_dat)){
  cat(paste0("\"", summarised_dat$url[[i]], "\":"), "\n")
  json_content <- paste0(json_content, "\"", summarised_dat$url[[i]], "\": {\n")
  for (j in 2:ncol(summarised_dat)) {
    json_content <- paste0(json_content, "\t\"", names(summarised_dat)[j],"\": ", summarised_dat[[i,j]])
    if (j != ncol(summarised_dat)) {
      json_content <- paste0(json_content, ",\n")
    } else {
      json_content <- paste0(json_content, "\n")
    }
  }
  if (i != nrow(summarised_dat)) {
    json_content <- paste0(json_content, "},\n")
  } else {
    json_content <- paste0(json_content, "}\n")
  }
  
}
json_content <- paste0(json_content, "}\n")
fileConn <- file("ratings.json")
writeLines(json_content, fileConn)
close(fileConn)
