
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;


public class PauseMenu : MonoBehaviour
{

   public GameObject Pausemenu;
   public GameObject ResumeButton;
   public GameObject PauseButton;
   public GameObject RestartButton;

   //public GameObject LevelWonMenu;
   //public GameObject LevelLostMenu;

    public void Pause() 

    {
        Pausemenu.SetActive (true); 
        PauseButton.SetActive (false); 
        RestartButton.SetActive (false); 
         
        Time.timeScale = 0;
    }

    public void Resume() 
    {
        Pausemenu.SetActive (false);
        PauseButton.SetActive (true); 
        RestartButton.SetActive (true); 

        Time.timeScale = 1;
    }

    public void Restart()
    {
        PauseButton.SetActive (false); 
        RestartButton.SetActive (false);
        Application.LoadLevel(Application.loadedLevel);
                Time.timeScale = 1;

    }

     public void MainMenu(int SceneIndex)
    {
        SceneManager.LoadScene(SceneIndex);
                Time.timeScale = 1;


    }
    public void Quit()
    {
        Application.Quit();
    }

      public void NextLevel()
    {
        NextLevel.SetActive(true);
        Pausemenu.SetActive (false);
        PauseButton.SetActive (false); 
        RestartButton.SetActive (false);
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);

                    Time.timeScale = 1;

    }

    

 


}