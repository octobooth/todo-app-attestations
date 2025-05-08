import initialData from '../../data/initialData.json';

/**
 * Service to hydrate the application with initial sample data
 */
export const DataHydrationService = {
  /**
   * Load sample task lists into the application
   * @returns {Array} Array of sample task lists
   */
  getInitialTaskLists: () => {
    return initialData.taskLists;
  },

  /**
   * Load sample tags into the application
   * @returns {Array} Array of sample tags
   */
  getInitialTags: () => {
    return initialData.tags;
  },

  /**
   * Load sample tasks into the application
   * @returns {Array} Array of sample tasks
   */
  getInitialTasks: () => {
    return initialData.tasks;
  },

  /**
   * Check if the application should be hydrated with sample data
   * This can be expanded to check localStorage or other conditions
   * @returns {boolean}
   */
  shouldHydrate: () => {
    // You can add logic here to check if hydration should occur
    // For example, checking if it's the first time the app is run
    return true;
  }
};