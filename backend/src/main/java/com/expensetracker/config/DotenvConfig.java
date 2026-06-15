package com.expensetracker.config;

import org.springframework.context.annotation.Configuration;

/**
 * spring-dotenv automatically loads .env from the working directory.
 * When running from /backend, place a symlink or copy .env here,
 * OR run the app from the project root:
 *   cd CAPESTONE && java -jar backend/target/expense-tracker-1.0.0.jar
 *
 * For development, the .env file is also picked up if present in backend/.
 * Recommended: copy or symlink the root .env into backend/ for local dev.
 */
@Configuration
public class DotenvConfig {
    // spring-dotenv handles .env loading automatically via its PropertySource
}
