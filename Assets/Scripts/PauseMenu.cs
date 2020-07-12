
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
         
        Time.timeScale = 1;
    }

    public void Resume() 
    {
        Pausemenu.SetActive (false);
        ResumeButton.SetActive (true);
        PauseButton.SetActive (true); 
        RestartButton.SetActive (true); 

        Time.timeScale = 1;
    }

    public void Restart()
    {
        Application.LoadLevel(Application.loadedLevel);
    }

     public void MainMenu(int SceneIndex)
    {
        SceneManager.LoadScene(SceneIndex);

    }
    public void Quit()
    {
        Application.Quit();
    }

      public void NextLevel()
    {
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
    }

    

 


}