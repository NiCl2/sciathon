library(shiny)
library(shinythemes)
library(shinyWidgets)
library(RCurl)
library(ggpubr)
library(glue)
library(mongolite)
library(shinycssloaders)
library(httr)

options(shiny.sanitize.errors = FALSE)
options(mongo_password = "")
mongo_user <- "NiCl2"
mongo_collection <- "article_scores1"
mongo_database <- "article_scores"
mongo_cluster <- "sciathon"
data_colnames <- c("url", "score", "sources1", "sources2", "bias1", "bias2", "clarity1", "clarity2")

ui <- fluidPage(
  uiOutput("block_one"),
  div(class = 'col-sm-2'),
  div(align = "center", class = 'col-sm-8',
      tagList(
        withSpinner(
          htmlOutput("exist")
        ), 
        br()
      )
  ),
  chooseSliderSkin(skin = "HTML5", color = "#943D93"),
  uiOutput("block_two"),
  div(align = "center",
      htmlOutput("score"), 
      conditionalPanel(
        condition = "input.block_two",
        actionButton("load_up", "Submit")
      )
  ),
  br(),br(),br(),br()
)

save_data <- function(url, score, answers) {
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
    
    data = c(url, score, answers)
    data <- as.data.frame(t(data), stringsAsFactors = FALSE)
    data[, 2:ncol(data)] <- sapply(data[, 2:ncol(data)], as.numeric)
    colnames(data) <- data_colnames
    # print(sapply(data, class))
    # 
    # print(data)
    
    # merge score categories
    data <- mutate(data, sources = floor(mean(c(sources1, sources2)) * 5)) %>% 
      mutate(bias = floor(mean(c(bias1, bias2)) * 5)) %>% 
      mutate(clarity = floor(mean(c(clarity1, clarity2)) * 5)) %>%
      dplyr::select(url, score, sources, bias, clarity)
    
    db$insert(data)
    rm(db)
}

submitted_modal <- function(){
  modalDialog(
    title = "Score submitted!",
    "Thank you. Please note that there may be a delay before your score is integrated with the browser extension",
    # easyClose = TRUE,
    footer = actionButton("dismiss_modal",label = "Done")
  )
}

server <- function(input, output, session) {
    
    output$block_one <- renderUI({
      div(class = 'container',
          br(), br(),
          div(class = 'col-sm-2'),
          div(class = 'col-sm-8',
              textInput("website", "Link to article", placeholder="Enter a URL"),
              actionButton("block_two", "Next"),
              br()
          )
      )
    })

    observeEvent(input$load_up, {
      save_data(input$website, 
                input$slider, 
                c(input$sources1,
                input$sources2,
                input$bias1,
                input$bias2,
                input$clarity1,
                input$clarity2)
                )
      showModal(submitted_modal())
    })
    
    observeEvent(input$dismiss_modal, session$reload())
    
    webtext <- eventReactive(input$block_two, {
        req(input$website != "")
        input$website
    })
    
    # (WHAT)
    output$exist = renderText({
        req(input$website != "")
        site = webtext()
        if(grepl("http", site)) site = gsub("https://|http://", "", site)
        if(url.exists(site)){
            out_text = glue("<font color=\"#943D93\"><b>{site}</b></font>")
        } else {
          out_text = glue("<font color=\"#DE4A2B\"><b>Invalid webpage</b></font>")
        }
    })
 
    
    ######### Present current article score ? #########
    
    observeEvent(input$block_two, {
      req(url.exists(webtext()))
      output$block_two <- renderUI({ source("scoring_questions.R", local = TRUE)$value })
    })
    
    
    output$score <- renderUI({
        req(webtext() != "" & url.exists(webtext()))

        score_vector = c("sources1" = as.numeric(input$sources1),
                         "sources2" = as.numeric(input$sources2),
                         "bias1" = as.numeric(input$bias1), 
                         "bias2" = as.numeric(input$bias2),
                         "clarity1" = as.numeric(input$clarity1),
                         "clarity2" = as.numeric(input$clarity2)
        )
        # print(score_vector)
        
        automatic_score = floor((sum(score_vector) / 6) * 5)
        
        tagList(tags$p("Suggested score: "),
                tags$h4(format(automatic_score, digits=2)),
                br(),
                sliderInput("slider",
                            HTML("Please give a rating from 0 to 10<br>(0: unreliable | 10: trustworthy)"),
                            0, 10, automatic_score, width = "50%" ))
    })
    
}

shinyApp(ui = ui, server = server)
